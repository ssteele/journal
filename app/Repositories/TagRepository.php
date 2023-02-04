<?php

namespace App\Repositories;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class TagRepository
{
    public function getSortedByFrequency()
    {
        return DB::table('tags')
            ->join('entry_has_tags', 'tags.id', '=', 'entry_has_tags.tag_id')
            ->select('id', 'name', DB::raw('count(*) as freq'))
            ->groupBy('id', 'name')
            ->orderBy('freq', 'desc')
            ->get();
    }

    public function getNamesSortedByFrequency()
    {
        return DB::table('tags')
            ->join('entry_has_tags', 'tags.id', '=', 'entry_has_tags.tag_id')
            ->select('name', DB::raw('count(*) as freq'))
            ->groupBy('name')
            ->orderBy('freq', 'desc')
            ->pluck('name');
    }

    public function getRecentNamesSortedByFrequency($date = null, $dayLimit = null)
    {
        if (!$date) {
            $date = Carbon::today();
        }
        $dayLimit = $dayLimit ?: config('constants.day_limit_recent_tags');
        $pastDate = $date->copy()->subDay($dayLimit);
        return DB::table('tags')
            ->join('entry_has_tags', 'tags.id', '=', 'entry_has_tags.tag_id')
            ->join('entries', 'entry_has_tags.entry_id', '=', 'entries.id')
            ->select('name', DB::raw('count(*) as freq'))
            ->whereBetween('entries.date', [$pastDate, $date])
            ->groupBy('name')
            ->orderBy('freq', 'desc')
            ->pluck('name');
    }

    public function getTimeline($id)
    {
        return DB::table('tags')
            ->join('entry_has_tags', 'tags.id', '=', 'entry_has_tags.tag_id')
            ->join('entries', 'entry_has_tags.entry_id', '=', 'entries.id')
            ->select('date', 'entries.id as entryId', 'tags.id as annotationId')
            ->where('tags.id', '=', $id)
            ->orderBy('date', 'desc')
            ->get();
    }

    public function getNamesForEntry($entryId)
    {
        return DB::table('tags')
            ->join('entry_has_tags', 'tags.id', '=', 'entry_has_tags.tag_id')
            ->distinct()
            ->where('entry_id', '=', $entryId)
            ->pluck('name');
    }

    public function getIdNamePairsForEntry($entryId)
    {
        return DB::table('tags')
            ->join('entry_has_tags', 'tags.id', '=', 'entry_has_tags.tag_id')
            ->select('id', 'name')
            ->where('entry_id', '=', $entryId)
            ->get();
    }
}
