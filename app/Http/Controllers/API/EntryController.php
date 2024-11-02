<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Entry;
use App\Repositories\EntryRepository;
use Illuminate\Http\Request;

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
     * Get entries by ids.
     *
     * @param  array  $ids
     * @return \Illuminate\Http\JsonResponse 
     */
    public function getList(Request $request)
    {
        $ids = $request->input('ids');
        $user = \Auth::user();

        $entries = Entry::whereIn('id', $ids)
            ->where('user_id', $user->id)
            ->get();
        return response()->json($entries);
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
