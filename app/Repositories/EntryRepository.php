<?php

namespace App\Repositories;

use App\Models\Entry;
use Illuminate\Support\Facades\DB;

class EntryRepository
{
    public function getRecent($limit = null)
    {
        return DB::table('entries')
            ->orderBy('date', 'desc')
            ->limit($limit ?: config('constants.date_limit'))
            ->get();
    }

    public function getRecentWithMentions($limit = null)
    {
        return Entry::with(['entryHasMention.mention'])
            ->orderBy('date', 'desc')
            ->limit($limit ?: config('constants.date_limit'))
            ->get();
    }
}
