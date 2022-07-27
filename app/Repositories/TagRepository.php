<?php

namespace App\Repositories;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class TagRepository
{
    public function getSortedByName()
    {
        return DB::table('tags')
            ->orderBy('name', 'asc')
            ->get();
    }

    public function getTimeline($id)
    {
        return DB::table('tags')
            ->join('entry_has_tags', 'tags.id', '=', 'entry_has_tags.tag_id')
            ->join('entries', 'entry_has_tags.entry_id', '=', 'entries.id')
            ->where('tags.id', '=', $id)
            ->orderBy('date', 'desc')
            ->get(['date']);
    }

    public function getNamesForEntry($id)
    {
        return DB::table('tags')
            ->join('entry_has_tags', 'tags.id', '=', 'entry_has_tags.tag_id')
            ->distinct()
            ->where('entry_id', '=', $id)
            ->pluck('name');
    }

    public function getIdNamePairsForEntry($id)
    {
        return DB::table('tags')
            ->join('entry_has_tags', 'tags.id', '=', 'entry_has_tags.tag_id')
            ->select('id', 'name')
            ->where('entry_id', '=', $id)
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

    public function getRecentNamesSortedByFrequency($date = null, $limit = null)
    {
        if (!$date) {
            $date = Carbon::today();
        }
        $limit = $limit ?: config('constants.date_limit');
        $pastDate = $date->copy()->subDay($limit);
        return DB::table('tags')
            ->join('entry_has_tags', 'tags.id', '=', 'entry_has_tags.tag_id')
            ->join('entries', 'entry_has_tags.entry_id', '=', 'entries.id')
            ->select('name', DB::raw('count(*) as freq'))
            ->whereBetween('entries.date', [$pastDate, $date])
            ->groupBy('name')
            ->orderBy('freq', 'desc')
            ->pluck('name');
    }
}
