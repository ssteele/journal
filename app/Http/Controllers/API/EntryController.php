<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Entry;
use App\Repositories\EntryRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
        try {
            $entry = Entry::where('id', $id)
                ->where('user_id', $user->id)
                ->firstOrFail();
            return response()->json($entry);
        } catch (\Exception $e) {
            return response('No entry found', 422);
        }
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
        try {
            $entries = Entry::whereIn('id', $ids)
                ->where('user_id', $user->id)
                ->get();
            if ($entries->count() > 0) {
                return response()->json($entries);
            }
            throw new \Exception('No entries found');
        } catch (\Exception $e) {
            return response('No entries found', 422);
        }
    }

    /**
     * Search entries by search term.
     *
     * @param  string  $searchTerm
     * @return \Illuminate\Http\JsonResponse 
     */
    public function search($searchTerm)
    {
        $user = \Auth::user();
        try {
            $entries = $this->entryRepository->search($searchTerm);
            if ($entries->count() > 0) {
                return response()->json($entries);
            }
            throw new \Exception('No search results');
        } catch (\Exception $e) {
            return response('No search results', 422);
        }
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
