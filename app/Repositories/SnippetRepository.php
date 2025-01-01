<?php

namespace App\Repositories;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class SnippetRepository
{
    public function get()
    {
        return DB::table('snippets')
            ->where('deleted', false)
            ->get();
    }

    public function getOrdered()
    {
        return DB::table('snippets')
            ->where('deleted', false)
            ->orderBy('order', 'asc')
            ->get();
    }

    public function getOrderedRepeating($nextDate)
    {
        $targetDate = new Carbon($nextDate);
        $targetDate->subDays(8);

        return DB::table('snippets')
            ->where('deleted', false)
            ->where('repeating', '=', '1')
            ->orWhere(function ($query) use ($targetDate) {
                $query->where('repeating', '=', '0')
                      ->whereDate('updated_at', '>', $targetDate);
            })
            ->orderBy('order', 'asc')
            ->get();
    }

    public function getOrderedEntrySnippets()
    {
        return DB::table('snippets')
            ->where('deleted', false)
            ->where('type', '=', 'entry')
            ->orderBy('order', 'asc')
            ->get();
    }

    public function getOrderedTagSnippets()
    {
        return DB::table('snippets')
            ->where('deleted', false)
            ->where('type', '=', 'tag')
            ->orderBy('order', 'asc')
            ->get();
    }

    public function getOrderedMentionSnippets()
    {
        return DB::table('snippets')
            ->where('deleted', false)
            ->where('type', '=', 'mention')
            ->orderBy('order', 'asc')
            ->get();
    }
}
