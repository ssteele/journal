<?php

namespace App\Repositories;

use Illuminate\Support\Facades\DB;

class MentionRepository
{
    public function getForEntry($id)
    {
        return DB::table('mentions')
            ->join('entry_has_mentions', 'mentions.id', '=', 'entry_has_mentions.mention_id')
            ->select('mentions.id', 'mentions.name')
            ->where('entry_has_mentions.entry_id', '=', $id)
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
}
