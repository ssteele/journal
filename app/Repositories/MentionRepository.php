<?php

namespace App\Repositories;

use Illuminate\Support\Facades\DB;

class MentionRepository
{
    public function getIdNamePairsForEntry($entryId)
    {
        return DB::table('mentions')
            ->join('entry_has_mentions', 'mentions.id', '=', 'entry_has_mentions.mention_id')
            ->select('id', 'name')
            ->where('entry_id', '=', $entryId)
            ->get();
    }

    public function getNamesSortedByFrequency()
    {
        return DB::table('mentions')
            ->join('entry_has_mentions', 'mentions.id', '=', 'entry_has_mentions.mention_id')
            ->select('name', DB::raw('count(*) as freq'))
            ->groupBy('name')
            ->orderBy('freq', 'desc')
            ->get(['name']);
    }
}
