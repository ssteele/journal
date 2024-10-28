<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Entry;
use App\Repositories\EntryRepository;

class EntryController extends Controller
{
    private $entryRepository;

    /**
     * Create a new controller instance
     *
     * @return void
     */
    public function __construct(
        EntryRepository $entryRepository,
    )
    {
        $this->middleware('auth');
        $this->entryRepository = $entryRepository;
    }

    /**
     * Get entry by id.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse 
     */
    public function get($id)
    {
        $user = \Auth::user();

        $entry = Entry::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();
        return response()->json($entry);
    }

    /**
     * Fetch more entries on index listing.
     *
     * @param  int  $lastFetchedId
     * @return \Illuminate\Http\JsonResponse 
     */
    public function moreEntries($lastFetchedId)
    {
        $result = $this->entryRepository->getMoreWithMentions($lastFetchedId, config('constants.day_limit'));
        return response()->json($result);
    }
}
