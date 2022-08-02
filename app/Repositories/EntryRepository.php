<?php

namespace App\Repositories;

use App\Models\Entry;
use Illuminate\Support\Facades\DB;

class EntryRepository
{
    public function getRecent($dayLimit = null)
    {
        return DB::table('entries')
            ->orderBy('date', 'desc')
            ->limit($dayLimit ?: config('constants.day_limit'))
            ->get();
    }

    public function getRecentWithMentions($dayLimit = null)
    {
        return Entry::with(['entryHasMention.mention'])
            ->orderBy('date', 'desc')
            ->limit($dayLimit ?: config('constants.day_limit'))
            ->get();
    }
}
