<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use App\Repositories\SnippetRepository;
use App\Repositories\TagRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SnippetController extends Controller
{
    private $snippetRepository;
    private $tagRepository;

    /**
     * Create a new controller instance
     *
     * @return void
     */
    public function __construct(
        SnippetRepository $snippetRepository,
        TagRepository $tagRepository,
    )
    {
        $this->middleware('auth');
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
        $snippets = $this->snippetRepository->get();
        $tags = $this->tagRepository->getSortedByFrequency();
        return Inertia::render('Snippets/Index')
            ->with('snippets', $snippets)
            ->with('tags', $tags);
    }

    /**
     * Show the form for creating a new snippet.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $tags = $this->tagRepository->getNamesSortedByFrequency();
        return Inertia::render('Snippets/Create')
            ->with('tags', $tags);
    }

    /**
     * Store a newly created snippet in storage.
     *
     * @param  \App\Http\Requests\StoreSnippetRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreSnippetRequest $request, Handler $annotationHandler)
    {

    }

    /**
     * Display the specified snippet.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {

    }

    /**
     * Show the form for editing the specified snippet.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {

    }

    /**
     * Update the specified snippet in storage.
     *
     * @param  \App\Http\Requests\UpdateEntryRequest  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateEntryRequest $request, $id, Handler $annotationHandler)
    {

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
