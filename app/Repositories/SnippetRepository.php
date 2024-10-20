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

    public function getOrdered()
    {
        return DB::table('snippets')
            ->orderBy('order', 'asc')
            ->get();
    }

    public function getOrderedEntrySnippets()
    {
        return DB::table('snippets')
            ->where('type', '=', 'entry')
            ->orderBy('order', 'asc')
            ->get();
    }

    public function getOrderedTagSnippets()
    {
        return DB::table('snippets')
            ->where('type', '=', 'tag')
            ->orderBy('order', 'asc')
            ->get();
    }

    public function getOrderedMentionSnippets()
    {
        return DB::table('snippets')
            ->where('type', '=', 'mention')
            ->orderBy('order', 'asc')
            ->get();
    }
}
