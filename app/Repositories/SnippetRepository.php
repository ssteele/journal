<?php

namespace App\Repositories;

use App\Models\Snippet;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class SnippetRepository
{
    public function get()
    {
        return DB::table('snippets')
            ->get();
    }
}
