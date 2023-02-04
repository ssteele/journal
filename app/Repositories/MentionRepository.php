<?php

namespace App\Repositories;

use Illuminate\Support\Facades\DB;

class MentionRepository
{
    public function getSortedByFrequency()
    {
        return DB::table('mentions')
            ->join('entry_has_mentions', 'mentions.id', '=', 'entry_has_mentions.mention_id')
            ->select('id', 'name', DB::raw('count(*) as freq'))
            ->groupBy('id', 'name')
            ->orderBy('freq', 'desc')
            ->get();
    }

    public function getNamesSortedByFrequency()
    {
        return DB::table('mentions')
            ->join('entry_has_mentions', 'mentions.id', '=', 'entry_has_mentions.mention_id')
            ->select('name', DB::raw('count(*) as freq'))
            ->groupBy('name')
            ->orderBy('freq', 'desc')
            ->pluck('name');
    }

    public function getTimeline($id)
    {
        return DB::table('mentions')
            ->join('entry_has_mentions', 'mentions.id', '=', 'entry_has_mentions.mention_id')
            ->join('entries', 'entry_has_mentions.entry_id', '=', 'entries.id')
            ->select('date', 'entries.id as entryId', 'mentions.id as annotationId')
            ->where('mentions.id', '=', $id)
            ->orderBy('date', 'desc')
            ->get();
    }

    public function getIdNamePairsForEntry($entryId)
    {
        return DB::table('mentions')
            ->join('entry_has_mentions', 'mentions.id', '=', 'entry_has_mentions.mention_id')
            ->select('id', 'name')
            ->where('entry_id', '=', $entryId)
            ->get();
    }
}
