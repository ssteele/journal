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
     * @param  Tag  $tag
     * @return \Illuminate\Http\Response
     */
    public function show(Tag $tag)
    {
        // grab tags and remove the current tag from the collection
        $tags = $this->tagRepository->getSortedByFrequency();
        $tagIndex = $tags->search(function ($item) use ($tag) {
            return $item->name === $tag->name;
        });
        $tags = $tags->forget($tagIndex)->collect()->values();

        $timeline = $this->tagRepository->getTimeline($tag->id);
        return Inertia::render('Tags/Show')
            ->with('tag', $tag)
            ->with('tags', $tags)
            ->with('timeline', $timeline);
    }

    /**
     * Display two tags.
     *
     * @param  Tag  $tag1
     * @param  Tag  $tag2
     * @return \Illuminate\Http\Response
     */
    public function compare(Tag $tag1, Tag $tag2)
    {
        $tags = [$tag1, $tag2];
        $timelines = [
            $this->tagRepository->getTimeline($tag1->id),
            $this->tagRepository->getTimeline($tag2->id),
        ];
        return Inertia::render('Tags/Compare')
            ->with('tags', $tags)
            ->with('timelines', $timelines);
    }

    // /**
    //  * Show the form for editing the specified tag.
    //  *
    //  * @param  Tag  $tag
    //  * @return \Illuminate\Http\Response
    //  */
    // public function edit(Tag $tag)
    // {
    //     //
    // }

    // /**
    //  * Update the specified tag in storage.
    //  *
    //  * @param  \Illuminate\Http\Request  $request
    //  * @param  Tag  $tag
    //  * @return \Illuminate\Http\Response
    //  */
    // public function update(Request $request, Tag $tag)
    // {
    //     //
    // }

    // /**
    //  * Remove the specified tag from storage.
    //  *
    //  * @param  Tag  $tag
    //  * @return \Illuminate\Http\Response
    //  */
    // public function destroy(Tag $tag)
    // {
    //     //
    // }
}
