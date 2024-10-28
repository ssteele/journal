<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSnippetRequest;
use App\Http\Requests\UpdateSnippetRequest;
use App\Models\Snippet;
use App\Repositories\MentionRepository;
use App\Repositories\SnippetRepository;
use App\Repositories\TagRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SnippetController extends Controller
{
    private $mentionRepository;
    private $snippetRepository;
    private $tagRepository;

    /**
     * Create a new controller instance
     *
     * @return void
     */
    public function __construct(
        MentionRepository $mentionRepository,
        SnippetRepository $snippetRepository,
        TagRepository $tagRepository,
    )
    {
        $this->middleware('auth');
        $this->mentionRepository = $mentionRepository;
        $this->snippetRepository = $snippetRepository;
        $this->tagRepository = $tagRepository;
    }

    /**
     * Display a listing of snippets.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $entrySnippets = $this->snippetRepository->getOrderedEntrySnippets();
        $tagSnippets = $this->snippetRepository->getOrderedTagSnippets();
        $mentionSnippets = $this->snippetRepository->getOrderedMentionSnippets();
        return Inertia::render('Snippets/Index')
            ->with('dbEntrySnippets', $entrySnippets)
            ->with('dbTagSnippets', $tagSnippets)
            ->with('dbMentionSnippets', $mentionSnippets);
    }

    /**
     * Show the form for creating a new snippet.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $mentions = $this->mentionRepository->getNamesSortedByFrequency();
        $tags = $this->tagRepository->getNamesSortedByFrequency();
        return Inertia::render('Snippets/Create')
            ->with('dbMentions', $mentions)
            ->with('dbTags', $tags);
    }

    /**
     * Store a newly created snippet in storage.
     *
     * @param  \App\Http\Requests\StoreSnippetRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreSnippetRequest $request)
    {
        // get authenticated user
        $user = \Auth::user();

        // save snippet
        $snippet = new Snippet($request->all());
        $entity = $user->snippet()->save($snippet);

        return redirect()->route('snippets.index');
    }

    /**
     * Show the form for editing the specified snippet.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $snippet = Snippet::find($id);
        $mentions = $this->mentionRepository->getNamesSortedByFrequency();
        $tags = $this->tagRepository->getNamesSortedByFrequency();
        return Inertia::render('Snippets/Edit')
            ->with('dbMentions', $mentions)
            ->with('dbSnippet', $snippet)
            ->with('dbTags', $tags);
    }

    /**
     * Update the specified snippet in storage.
     *
     * @param  \App\Http\Requests\UpdateSnippetRequest  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateSnippetRequest $request, $id)
    {
        // get the things
        $user = \Auth::user();
        $snippet = Snippet::find($id);
        $update = new Snippet($request->all());

        // update fillable fields (except user_id), then save
        $fillable = array_filter($update->getFillable(), function ($prop) {
            return $prop != 'user_id';
        });
        foreach ($fillable as $prop) {
            $snippet->$prop = $update->$prop;
        }
        $snippet->save();

        return redirect()->route('snippets.index');
    }

    /**
     * Remove the specified snippet from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
