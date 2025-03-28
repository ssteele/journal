<?php

namespace App\Repositories;

use Illuminate\Support\Facades\DB;

class MentionRepository
{
    public function getSortedByFrequency()
    {
        return DB::table('mentions')
            ->where('mentions.enabled', true)
            ->where('mentions.deleted', false)
            ->join('entry_has_mentions', 'mentions.id', '=', 'entry_has_mentions.mention_id')
            ->select('id', 'name', DB::raw('count(*) as freq'))
            ->groupBy('id', 'name')
            ->orderBy('freq', 'desc')
            ->get();
    }

    public function getNamesSortedByFrequency()
    {
        return DB::table('mentions')
            ->where('mentions.enabled', true)
            ->where('mentions.deleted', false)
            ->join('entry_has_mentions', 'mentions.id', '=', 'entry_has_mentions.mention_id')
            ->select('name', DB::raw('count(*) as freq'))
            ->groupBy('name')
            ->orderBy('freq', 'desc')
            ->pluck('name');
    }

    public function getRecentNamesSortedByFrequency($date = null, $dayLimit = null)
    {
        if (!$date) {
            $date = Carbon::today(config('constants.timezone'));
        }
        $dayLimit = $dayLimit ?: config('constants.day_limit_recent_mentions');
        $pastDate = $date->copy()->subDay($dayLimit);
        return DB::table('mentions')
            ->where('mentions.enabled', true)
            ->where('mentions.deleted', false)
            ->join('entry_has_mentions', 'mentions.id', '=', 'entry_has_mentions.mention_id')
            ->join('entries', 'entry_has_mentions.entry_id', '=', 'entries.id')
            ->select('name', DB::raw('count(*) as freq'))
            ->whereBetween('entries.date', [$pastDate, $date])
            ->groupBy('name')
            ->orderBy('freq', 'desc')
            ->pluck('name');
    }

    public function getTimeline($id)
    {
        return DB::table('mentions')
            ->where('mentions.enabled', true)
            ->where('mentions.deleted', false)
            ->join('entry_has_mentions', 'mentions.id', '=', 'entry_has_mentions.mention_id')
            ->join('entries', 'entry_has_mentions.entry_id', '=', 'entries.id')
            ->select('date', 'entries.id as entryId', 'mentions.id as annotationId')
            ->where('mentions.id', '=', $id)
            ->orderBy('date', 'desc')
            ->get();
    }

    public function getNamesForEntry($entryId)
    {
        return DB::table('mentions')
            ->where('mentions.enabled', true)
            ->where('mentions.deleted', false)
            ->join('entry_has_mentions', 'mentions.id', '=', 'entry_has_mentions.mention_id')
            ->distinct()
            ->where('entry_id', '=', $entryId)
            ->pluck('name');
    }

    public function getIdNamePairsForEntry($entryId)
    {
        return DB::table('mentions')
            ->where('mentions.enabled', true)
            ->where('mentions.deleted', false)
            ->join('entry_has_mentions', 'mentions.id', '=', 'entry_has_mentions.mention_id')
            ->select('id', 'name')
            ->where('entry_id', '=', $entryId)
            ->get();
    }
}
