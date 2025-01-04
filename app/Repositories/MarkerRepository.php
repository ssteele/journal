<?php

namespace App\Repositories;

use Illuminate\Support\Facades\DB;

class MarkerRepository
{
    public function get()
    {
        return DB::table('markers')
            ->where('markers.enabled', true)
            ->where('markers.deleted', false)
            ->join('entries', 'markers.entry_id', '=', 'entries.id')
            ->select('marker_category_id', 'entry_id', 'marker', 'date')
            ->orderBy('entry_id', 'desc')
            ->get();
    }

    public function getForEntry($entryId)
    {
        return DB::table('markers')
            ->where('markers.enabled', true)
            ->where('markers.deleted', false)
            ->join('entries', 'markers.entry_id', '=', 'entries.id')
            ->select('marker_category_id', 'marker')
            ->where('entry_id', '=', $entryId)
            ->get();
    }
}
