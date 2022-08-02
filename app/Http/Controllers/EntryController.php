<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEntryRequest;
use App\Http\Requests\UpdateEntryRequest;
use App\Http\Requests\UploadEntryRequest;
use App\Models\Entry;
use App\Services\Annotation\Handler;
use App\Repositories\EntryRepository;
use App\Repositories\MentionRepository;
use App\Repositories\TagRepository;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class EntryController extends Controller
{
    private $entryRepository;
    private $tagRepository;
    private $mentionRepository;

    // /** @var float */
    // private $average = 0;
    // @todo: https://github.com/ssteele/archived-journal/blob/6eb545c781c962cd6d781d8c1d36f0559c95fcd3/app/Http/Controllers/EntryController.php#L58


    /**
     * Create a new controller instance
     *
     * @return void
     */
    public function __construct(
        EntryRepository $entryRepository,
        TagRepository $tagRepository,
        MentionRepository $mentionRepository,
    )
    {
        $this->middleware('auth');
        $this->entryRepository = $entryRepository;
        $this->tagRepository = $tagRepository;
        $this->mentionRepository = $mentionRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $entries = $this->entryRepository->getRecentWithMentions(config('constants.day_limit'));
        return Inertia::render('Entries/Index')
            ->with('entries', $entries);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $tags = $this->tagRepository->getNamesSortedByFrequency();
        $mentions = $this->mentionRepository->getNamesSortedByFrequency();
        $recentTags = $this->tagRepository->getRecentNamesSortedByFrequency(Carbon::today(), config('constants.day_limit_recent_tags'));
        return Inertia::render('Entries/Create')
            ->with('mentions', $mentions)
            ->with('recentTags', $recentTags)
            ->with('tags', $tags);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreEntryRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreEntryRequest $request, Handler $annotationHandler)
    {
        // get authenticated user
        $user = \Auth::user();

        // save entry
        $entry = new Entry($request->all());
        $entity = $user->entry()->save($entry);

        // set annotations
        $annotationHandler->setUserId($user->id);
        $annotationHandler->setEntryId($entity->id);
        $annotationHandler->setEntryText($entity->entry);

        // save annotations
        $annotationHandler->extract();
        $annotationHandler->save();

        if (is_null($request->bulk)) {
            return redirect()->route('entries.update', $entity->id);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $entry = Entry::find($id);
        $tags = $this->tagRepository->getIdNamePairsForEntry($entry->id);
        $mentions = $this->mentionRepository->getIdNamePairsForEntry($entry->id);
        $idsPrevNext = [
            'prev' => Entry::where('id', '<', $id)->max('id'),
            'next' => Entry::where('id', '>', $id)->min('id'),
        ];
        return Inertia::render('Entries/Show')
            ->with('entry', $entry)
            ->with('idsPrevNext', $idsPrevNext)
            ->with('mentions', $mentions)
            ->with('tags', $tags);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $entry = Entry::find($id);
        $entryDate = Carbon::parse($entry['date']);
        $tags = $this->tagRepository->getNamesSortedByFrequency();
        $mentions = $this->mentionRepository->getNamesSortedByFrequency();
        $currentTags = $this->tagRepository->getNamesForEntry($entry->id);
        $recentTags = $this->tagRepository->getRecentNamesSortedByFrequency($entryDate, config('constants.day_limit_recent_tags'));
        return Inertia::render('Entries/Edit')
            ->with('currentTags', $currentTags)
            ->with('entry', $entry)
            ->with('mentions', $mentions)
            ->with('recentTags', $recentTags)
            ->with('tags', $tags);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateEntryRequest  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateEntryRequest $request, $id, Handler $annotationHandler)
    {
        // get/create the things
        $user = \Auth::user();
        $entry = Entry::find($id);
        $update = new Entry($request->all());

        // update fillable fields (except user_id), then save
        $fillable = array_filter($update->getFillable(), function ($prop) {
            return $prop != 'user_id';
        });
        foreach ($fillable as $prop) {
            $entry->$prop = $update->$prop;
        }
        $entry->save();

        // set annotations
        $annotationHandler->setUserId($user->id);
        $annotationHandler->setEntryId($id);
        $annotationHandler->setEntryText($entry->entry);

        // clear existing annotations
        $annotationHandler->clear();

        // save annotations
        $annotationHandler->extract();
        $annotationHandler->save();

        if (is_null($request->bulk)) {
            return redirect()->route('entries.update', $id);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    /**
     * Use maatwebsite/excel package to extract CSV data
     * @param  object $csvUpload    File upload
     */
    private function extractCsvData($csvUpload)
    {
        $headers = [];
        $rows = [];
        if (false !== ($file = fopen($csvUpload, 'r'))) {
            if (false !== ($data = fgetcsv($file, 1000, '|'))) {        
                $headers = array_map('strtolower', $data); 
            }

            while (false !== ($data = fgetcsv($file, null, '|'))) {        
                $rows[] = array_combine($headers, $data);
            }
            fclose($file);
        }

        return $rows;
    }

    /**
     * Show the form for saving several journal entries
     *
     * @return Response
     */
    public function createUpload()
    {
        return Inertia::render('Entries/Upload');
    }

    /**
     * Save several journal entries
     *
     * @return Response
     */
    public function storeUpload(UploadEntryRequest $request, Handler $annotationHandler)
    {
        $csv = $request->file('csv');
        $filePath = base_path() . '/public/';
        $fileUpload = $csv->move($filePath, $csv);

        $csvRows = $this->extractCsvData($fileUpload);
        foreach ($csvRows as $row) {
            // pass through entry request validation
            $entryRequest = new StoreEntryRequest;
            $entryRequest->replace([
                'user'  => \Auth::user(),
                'date'  => Carbon::createFromFormat('m.d.y', $row['date'])->toDateTimeString(),
                'tempo' => $row['tempo'],
                'entry' => $row['entry'],
                'bulk'  => true,
            ]);

            $this->store($entryRequest, $annotationHandler);
        }
        // delete uploaded csv
        unlink($fileUpload);

        return redirect()->route('entries.index');
    }
}
