<?php

namespace App\Repositories;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class TagRepository
{
    const DEFAULT_DATE_LIMIT = 28;

    public function getForEntry($id)
    {
        return DB::table('tags')
            ->join('entry_has_tags', 'tags.id', '=', 'entry_has_tags.tag_id')
            ->select('tags.id', 'tags.name')
            ->where('entry_has_tags.entry_id', '=', $id)
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

    public function getRecentNamesSortedByFrequency($date = null, $limit = self::DEFAULT_DATE_LIMIT)
    {
        if (!$date) {
            $date = Carbon::today();
        }
        $pastDate = $date->copy()->subDay($limit);
        return DB::table('tags')
            ->join('entry_has_tags', 'tags.id', '=', 'entry_has_tags.tag_id')
            ->join('entries', 'entry_has_tags.entry_id', '=', 'entries.id')
            ->select('tags.name', DB::raw('count(*) as freq'))
            ->whereBetween('entries.date', [$pastDate, $date])
            ->groupBy('tags.name')
            ->orderBy('freq', 'desc')
            ->pluck('name');
    }
}
