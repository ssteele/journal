<?php

namespace App\Http\Controllers;

use App\Models\Mention;
use App\Repositories\MentionRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MentionController extends Controller
{
    private $mentionRepository;

    /**
     * Create a new controller instance
     *
     * @return void
     */
    public function __construct(
        MentionRepository $mentionRepository,
    )
    {
        $this->middleware('auth');
        $this->mentionRepository = $mentionRepository;
    }

    /**
     * Display a listing of mentions.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $mentions = $this->mentionRepository->getSortedByFrequency();
        return Inertia::render('Mentions/Index')
            ->with('mentions', $mentions);
    }

    /**
     * Display the specified mention.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $mention = Mention::find($id);
        $timeline = $this->mentionRepository->getTimeline($id);
        return Inertia::render('Mentions/Show')
            ->with('mention', $mention)
            ->with('timeline', $timeline);
    }

    /**
     * Display two mentions.
     *
     * @param  int  $id1
     * @param  int  $id2
     * @return \Illuminate\Http\Response
     */
    public function compare($id1, $id2)
    {
        $mentions = [Mention::find($id1), Mention::find($id2)];
        $timelines = [
            $this->mentionRepository->getTimeline($id1),
            $this->mentionRepository->getTimeline($id2),
        ];
        return Inertia::render('Mentions/Compare')
            ->with('mentions', $mentions)
            ->with('timelines', $timelines);
    }

    // /**
    //  * Show the form for editing the specified mention.
    //  *
    //  * @param  int  $id
    //  * @return \Illuminate\Http\Response
    //  */
    // public function edit($id)
    // {
    //     //
    // }

    // /**
    //  * Update the specified mention in storage.
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
    //  * Remove the specified mention from storage.
    //  *
    //  * @param  int  $id
    //  * @return \Illuminate\Http\Response
    //  */
    // public function destroy($id)
    // {
    //     //
    // }
}
