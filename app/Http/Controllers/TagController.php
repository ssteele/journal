<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use App\Repositories\TagRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TagController extends Controller
{
    private $tagRepository;

    /**
     * Create a new controller instance
     *
     * @return void
     */
    public function __construct(
        TagRepository $tagRepository,
    )
    {
        $this->middleware('auth');
        $this->tagRepository = $tagRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $tags = $this->tagRepository->getSortedByName();
        return Inertia::render('Tags/Index')
            ->with('tags', $tags);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $tag = Tag::find($id);
        $timeline = $this->tagRepository->getTimeline($id);
        return Inertia::render('Tags/Show')
            ->with('tag', $tag)
            ->with('timeline', $timeline);
    }

    // /**
    //  * Show the form for editing the specified resource.
    //  *
    //  * @param  \App\Models\Tag  $tag
    //  * @return \Illuminate\Http\Response
    //  */
    // public function edit(Tag $tag)
    // {
    //     //
    // }

    // /**
    //  * Update the specified resource in storage.
    //  *
    //  * @param  \Illuminate\Http\Request  $request
    //  * @param  \App\Models\Tag  $tag
    //  * @return \Illuminate\Http\Response
    //  */
    // public function update(Request $request, Tag $tag)
    // {
    //     //
    // }

    // /**
    //  * Remove the specified resource from storage.
    //  *
    //  * @param  \App\Models\Tag  $tag
    //  * @return \Illuminate\Http\Response
    //  */
    // public function destroy(Tag $tag)
    // {
    //     //
    // }
}
