<?php

namespace App\Repositories;

use App\Models\Entry;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class EntryRepository
{
    public function getRecent($dayLimit = null)
    {
        return DB::table('entries')
            ->where('enabled', true)
            ->where('deleted', false)
            ->orderBy('date', 'desc')
            ->limit($dayLimit ?: config('constants.day_limit'))
            ->get();
    }

    public function getRecentWithMentions($dayLimit = null)
    {
        return Entry::with(['entryHasMention.mention'])
            ->where('enabled', true)
            ->where('deleted', false)
            ->orderBy('date', 'desc')
            ->limit($dayLimit ?: config('constants.day_limit'))
            ->get();
    }

    public function getMoreWithMentions($lastFetchedId, $dayLimit = null)
    {
        return Entry::with(['entryHasMention.mention'])
            ->where('enabled', true)
            ->where('deleted', false)
            ->where('id', '<', $lastFetchedId)
            ->orderBy('date', 'desc')
            ->limit($dayLimit ?: config('constants.day_limit'))
            ->get();
    }

    public function getRange($startDate = null, $endDate = null)
    {
        return DB::table('entries')
            ->where('enabled', true)
            ->where('deleted', false)
            ->when($startDate, function ($query, $startDate) {
                $query->where('date', '>=', $startDate);
            })
            ->when($endDate, function ($query, $endDate) {
                $query->where('date', '<=', $endDate);
            })
            ->orderBy('date', 'desc')
            ->get();
    }

    public function getDateFollowing()
    {
        $entry = DB::table('entries')
            ->where('enabled', true)
            ->where('deleted', false)
            ->orderBy('date', 'desc')
            ->limit(1)
            ->get('date');
        $date = Carbon::parse($entry[0]->date);
        return $date->addDay()->toDateString();
    }

    public function getToday()
    {
        $today = Carbon::today(config('constants.timezone'));
        $entry = DB::table('entries')
            ->where('enabled', true)
            ->where('deleted', false)
            ->whereDate('date', '=', $today)
            ->limit(1)
            ->get();
        return $entry;
    }

    public function getDate(string $date)
    {
        $entry = DB::table('entries')
            ->where('enabled', true)
            ->where('deleted', false)
            ->whereDate('date', '=', $date)
            ->limit(1)
            ->first();
        return $entry;
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
        $entries = DB::table('entries')
            ->where('user_id', $user->id)
            ->where('entry', 'like', '%' . $searchTerm . '%')
            ->orderBy('date', 'desc')
            ->get();
        return $entries;
    }
}
