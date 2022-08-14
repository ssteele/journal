<?php

namespace App\Repositories;

use Illuminate\Support\Facades\DB;

class MarkerRepository
{
    public function get($limit = null)
    {
        return DB::table('markers')
            ->select('marker_category_id', 'entry_id', 'marker')
            ->orderBy('entry_id', 'desc')
            // ->limit($limit ?: config('constants.marker_limit'))
            ->get();
    }

    public function getForEntry($entryId)
    {
        return DB::table('markers')
            ->join('entries', 'markers.entry_id', '=', 'entries.id')
            ->select('marker_category_id', 'marker')
            ->where('entry_id', '=', $entryId)
            ->get();
    }
}
