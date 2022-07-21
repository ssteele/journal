<?php

namespace App\Repositories;

use Illuminate\Support\Facades\DB;

class EntryRepository
{
    const DEFAULT_DATE_LIMIT = 28;

    public function getRecent($limit = self::DEFAULT_DATE_LIMIT)
    {
        return DB::table('entries')
            ->orderBy('date', 'desc')
            ->limit($limit)
            ->get();
    }
}
