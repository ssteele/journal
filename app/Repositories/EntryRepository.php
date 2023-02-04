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
            ->orderBy('date', 'desc')
            ->limit($dayLimit ?: config('constants.day_limit'))
            ->get();
    }

    public function getRecentWithMentions($dayLimit = null)
    {
        return Entry::with(['entryHasMention.mention'])
            ->orderBy('date', 'desc')
            ->limit($dayLimit ?: config('constants.day_limit'))
            ->get();
    }

    public function getMoreWithMentions($lastFetchedId, $dayLimit = null)
    {
        return Entry::with(['entryHasMention.mention'])
            ->where('id', '<', $lastFetchedId)
            ->orderBy('date', 'desc')
            ->limit($dayLimit ?: config('constants.day_limit'))
            ->get();
    }

    public function getDateFollowing()
    {
        $entry = DB::table('entries')
            ->orderBy('date', 'desc')
            ->limit(1)
            ->get('date');
        $date = Carbon::parse($entry[0]->date);
        return $date->addDay()->toDateString();
    }

    public function getToday()
    {
        $today = Carbon::today();
        $entry = DB::table('entries')
            ->whereDate('date', '=', $today)
            ->limit(1)
            ->get();
        return $entry;
    }
}
