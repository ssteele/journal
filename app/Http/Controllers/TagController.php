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
     * Display a listing of tags.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $tags = $this->tagRepository->getSortedByFrequency();
        return Inertia::render('Tags/Index')
            ->with('tags', $tags);
    }

    /**
     * Display the specified tag.
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

    /**
     * Display two tags.
     *
     * @param  int  $id1
     * @param  int  $id2
     * @return \Illuminate\Http\Response
     */
    public function compare($id1, $id2)
    {
        $tags = [Tag::find($id1), Tag::find($id2)];
        $timelines = [
            $this->tagRepository->getTimeline($id1),
            $this->tagRepository->getTimeline($id2),
        ];
        return Inertia::render('Tags/Compare')
            ->with('tags', $tags)
            ->with('timelines', $timelines);
    }

    // /**
    //  * Show the form for editing the specified tag.
    //  *
    //  * @param  int  $id
    //  * @return \Illuminate\Http\Response
    //  */
    // public function edit($id)
    // {
    //     //
    // }

    // /**
    //  * Update the specified tag in storage.
    //  *
    //  * @param  \Illuminate\Http\Request  $request
    //  * @param  int  $id
    //  * @return \Illuminate\Http\Response
    //  */
    // public function update(Request $request, $id)
    // {
    //     //
    // }

    // /**
    //  * Remove the specified tag from storage.
    //  *
    //  * @param  int  $id
    //  * @return \Illuminate\Http\Response
    //  */
    // public function destroy($id)
    // {
    //     //
    // }
}
