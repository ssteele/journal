<?php

namespace App\Repositories;

use Illuminate\Support\Facades\DB;

class SnippetRepository
{
    public function get()
    {
        return DB::table('snippets')
            ->get();
    }
}
