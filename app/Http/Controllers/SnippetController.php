<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSnippetRequest;
use App\Http\Requests\UpdateSnippetRequest;
use App\Models\Snippet;
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
        $tags = $this->tagRepository->getNamesSortedByFrequency();
        return Inertia::render('Snippets/Edit')
            ->with('snippet', $snippet)
            ->with('tags', $tags);
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
