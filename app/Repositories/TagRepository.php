<?php

namespace App\Repositories;

use Illuminate\Support\Facades\DB;

class TagRepository
{
    public function getSortedByFrequency()
    {
        return DB::table('tags')
            ->join('entry_has_tags', 'tags.id', '=', 'entry_has_tags.tag_id')
            ->select('name', DB::raw('count(*) as freq'))
            ->groupBy('name')
            ->orderBy('freq', 'desc')
            ->pluck('name');
    }
}
