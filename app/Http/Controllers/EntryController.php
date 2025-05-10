<?php

namespace App\Http\Controllers;

use App\Http\Requests\ExportEntryRequest;
use App\Http\Requests\StoreEntryRequest;
use App\Http\Requests\UpdateEntryRequest;
use App\Http\Requests\UploadEntryRequest;
use App\Models\Entry;
use App\Services\Annotation\Handler;
use App\Repositories\EntryRepository;
use App\Repositories\MarkerCategoryRepository;
use App\Repositories\MarkerRepository;
use App\Repositories\MentionRepository;
use App\Repositories\SnippetRepository;
use App\Repositories\TagRepository;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use File;
use ZipArchive;

class EntryController extends Controller
{
    private $entryRepository;
    private $markerCategoryRepository;
    private $markerRepository;
    private $mentionRepository;
    private $snippetRepository;
    private $tagRepository;

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
        MarkerCategoryRepository $markerCategoryRepository,
        MarkerRepository $markerRepository,
        MentionRepository $mentionRepository,
        SnippetRepository $snippetRepository,
        TagRepository $tagRepository,
    )
    {
        $this->middleware('auth');
        $this->entryRepository = $entryRepository;
        $this->markerCategoryRepository = $markerCategoryRepository;
        $this->markerRepository = $markerRepository;
        $this->mentionRepository = $mentionRepository;
        $this->snippetRepository = $snippetRepository;
        $this->tagRepository = $tagRepository;
    }

    /**
     * Display a listing of entries.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $entries = $this->entryRepository->getRecentWithMentions(config('constants.day_limit'));
        return Inertia::render('Entries/Index')
            ->with('dbEntries', $entries);
    }

    /**
     * Show the form for creating a new entry.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $todayDate = Carbon::today(config('constants.timezone'));
        $nextDate = $this->entryRepository->getDateFollowing();

        $allTags = $this->tagRepository->getNamesSortedByFrequency();
        $suggestedTags = $this->tagRepository->getRecentNamesSortedByFrequency($todayDate, config('constants.day_limit_suggested_mentions'));
        $tags = $suggestedTags->merge($allTags)->unique()->values();
        $recentTags = $this->tagRepository->getRecentNamesSortedByFrequency($todayDate, config('constants.day_limit_recent_tags'));

        $allMentions = $this->mentionRepository->getNamesSortedByFrequency();
        $suggestedMentions = $this->mentionRepository->getRecentNamesSortedByFrequency($todayDate, config('constants.day_limit_suggested_mentions'));
        $mentions = $suggestedMentions->merge($allMentions)->unique()->values();
        $recentMentions = $this->mentionRepository->getRecentNamesSortedByFrequency($todayDate, config('constants.day_limit_recent_mentions'));

        $snippets = $this->snippetRepository->getOrderedRepeating($nextDate);

        return Inertia::render('Entries/Create')
            ->with('dbMentions', $mentions)
            ->with('dbNextDate', $nextDate)
            ->with('dbRecentMentions', $recentMentions)
            ->with('dbRecentTags', $recentTags)
            ->with('dbSnippets', $snippets)
            ->with('dbTags', $tags);
    }

    /**
     * Store a newly created entry in storage.
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
            return redirect()->route('entries.update', $entity->date);
        }
    }

    /**
     * Display the specified entry.
     *
     * @param  Entry  $entry
     * @return \Illuminate\Http\Response
     */
    public function show(Entry $entry)
    {
        $datesPrevNext = [
            'prev' => Entry::where('date', '<', $entry->date)->max('date'),
            'next' => Entry::where('date', '>', $entry->date)->min('date'),
            'dateToday' => Carbon::today(config('constants.timezone'))->toDateString(),
            'dateNext' => Carbon::parse($entry->date)->addDay()->toDateString(),
        ];
        $markerCategories = $this->markerCategoryRepository->get();
        $markers = $this->markerRepository->getForEntry($entry->id);
        $mentions = $this->mentionRepository->getIdNamePairsForEntry($entry->id);
        $tags = $this->tagRepository->getIdNamePairsForEntry($entry->id);
        return Inertia::render('Entries/Show')
            ->with('dbDatesPrevNext', $datesPrevNext)
            ->with('dbEntry', $entry)
            ->with('dbMarkerCategories', $markerCategories)
            ->with('dbMarkers', $markers)
            ->with('dbMentions', $mentions)
            ->with('dbTags', $tags);
    }

    /**
     * Show the form for editing the specified entry.
     *
     * @param  Entry  $entry
     * @return \Illuminate\Http\Response
     */
    public function edit(Entry $entry)
    {
        $entryDate = Carbon::parse($entry['date']);

        $datesPrevNext = [
            'prev' => Entry::where('date', '<', $entryDate)->max('date'),
            'next' => Entry::where('date', '>', $entryDate)->min('date'),
            'dateToday' => Carbon::today(config('constants.timezone'))->toDateString(),
            'dateNext' => $entryDate->addDay()->toDateString(),
        ];

        $allTags = $this->tagRepository->getNamesSortedByFrequency();
        $suggestedTags = $this->tagRepository->getRecentNamesSortedByFrequency($entryDate, config('constants.day_limit_suggested_mentions'));
        $tags = $suggestedTags->merge($allTags)->unique()->values();
        $recentTags = $this->tagRepository->getRecentNamesSortedByFrequency($entryDate, config('constants.day_limit_recent_tags'));
        $currentTags = $this->tagRepository->getNamesForEntry($entry->id);

        $allMentions = $this->mentionRepository->getNamesSortedByFrequency();
        $suggestedMentions = $this->mentionRepository->getRecentNamesSortedByFrequency($entryDate, config('constants.day_limit_suggested_mentions'));
        $mentions = $suggestedMentions->merge($allMentions)->unique()->values();
        $recentMentions = $this->mentionRepository->getRecentNamesSortedByFrequency($entryDate, config('constants.day_limit_recent_mentions'));
        $currentMentions = $this->mentionRepository->getNamesForEntry($entry->id);

        $snippets = $this->snippetRepository->get();

        return Inertia::render('Entries/Edit')
            ->with('dbCurrentMentions', $currentMentions)
            ->with('dbCurrentTags', $currentTags)
            ->with('dbDatesPrevNext', $datesPrevNext)
            ->with('dbEntry', $entry)
            ->with('dbMentions', $mentions)
            ->with('dbRecentMentions', $recentMentions)
            ->with('dbRecentTags', $recentTags)
            ->with('dbSnippets', $snippets)
            ->with('dbTags', $tags);
    }

    /**
     * Update the specified entry in storage.
     *
     * @param  \App\Http\Requests\UpdateEntryRequest  $request
     * @param  Entry  $entry
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateEntryRequest $request, Entry $entry, Handler $annotationHandler)
    {
        // get the things
        $user = \Auth::user();
        $update = new Entry($request->all());

        $fillable = $update->getFillable();
        foreach ($fillable as $prop) {
            $entry->$prop = $update->$prop;
        }
        $entry->save();

        // set annotations
        $annotationHandler->setUserId($user->id);
        $annotationHandler->setEntryId($entry->id);
        $annotationHandler->setEntryText($entry->entry);

        // clear existing annotations
        $annotationHandler->clear();

        // save annotations
        $annotationHandler->extract();
        $annotationHandler->save();

        if (is_null($request->bulk)) {
            return redirect()->route('entries.update', $entry->date);
        }
    }

    /**
     * Remove the specified entry from storage.
     *
     * @param  Entry  $entry
     * @return \Illuminate\Http\Response
     */
    public function destroy(Entry $entry)
    {
        //
    }

    /**
     * Redirect to today's entry or create new if entry doesn't exist.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function today()
    {
        $entry = $this->entryRepository->getToday();
        if ($entry->count()) {
            $entryDate = $entry[0]->date;
            return redirect()->route('entries.edit', $entryDate);
        } else {
            return redirect()->route('entries.create');
        }
    }

    /**
     * Redirect to next entry or create new if entry doesn't exist.
     *
     * @param  Entry  $entry
     * @return \Illuminate\Http\RedirectResponse
     */
    public function next(string $date)
    {
        $entry = $this->entryRepository->getDate($date);
        if ($entry) {
            return redirect()->route('entries.show', $entry->date);
        } else {
            return redirect()->route('entries.create');
        }
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
     * Show the entry search page
     *
     * @return Response
     */
    public function search()
    {
        return Inertia::render('Entries/Search');
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

    /**
     * Show the form for exporting journal entries
     *
     * @return Response
     */
    public function createExport()
    {
        return Inertia::render('Entries/Export');
    }

    /**
     * Download zip export
     *
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     */
    public function downloadExport(ExportEntryRequest $request)
    {
        $entries = $this->entryRepository->getRange($request->startDate, $request->endDate);
        if (!count($entries)) {
            // @todo: redirect and pass the following to flash notify
            return 'No entries found for the date range';
        }

        // create output files
        $exportDirectory = 'entries-export';
        foreach ($entries as $entry) {
            $day = Carbon::createFromFormat('Y-m-d', $entry->date, config('constants.timezone'))->format('l F j, Y');
            $content = $entry->entry;

            // @todo: replace annotations with read-as equivalent

            $fileContent = "$day\n\n" . $content;
            $fileName = $entry->date . '.txt';
            $filePath = $exportDirectory . '/' . $fileName;
            Storage::disk('public')->put($filePath, $fileContent);
        }

        // create zip file
        $zip = new ZipArchive;
        $zipFileName = 'download.zip';
        if ($zip->open(public_path($zipFileName), ZipArchive::CREATE) === TRUE) {
            $files = File::files(storage_path('app/public/entries-export'));
            foreach ($files as $key => $value){
                $relativeName = basename($value);
                $zip->addFile($value, $relativeName);
            }

            $zip->close();

        } else {
            // @todo: redirect and pass the following to flash notify
            return 'Failed to create the zip file';
        }

        // clean up
        Storage::disk('public')->deleteDirectory($exportDirectory);

        // trigger download
        return response()
            ->download(public_path($zipFileName))
            ->deleteFileAfterSend(true);
    }
}
