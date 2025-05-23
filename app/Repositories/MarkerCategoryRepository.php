<?php

namespace App\Repositories;

use Illuminate\Support\Facades\DB;

class MarkerCategoryRepository
{
    public function get()
    {
        return DB::table('marker_categories')
            ->where('enabled', true)
            ->where('deleted', false)
            ->get();
    }
}
