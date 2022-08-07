<?php

namespace App\Repositories;

use Illuminate\Support\Facades\DB;

class MarkerRepository
{
    public function getForEntry($entryId)
    {
        return DB::table('markers')
            ->join('entries', 'markers.entry_id', '=', 'entries.id')
            ->select('marker_category_id', 'marker')
            ->where('entry_id', '=', $entryId)
            ->get();
    }
}
