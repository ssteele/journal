<?php

namespace App\Repositories;

use App\Models\Entry;
use Illuminate\Support\Facades\DB;

class EntryRepository
{
    const DEFAULT_DATE_LIMIT = 28;

    public function getRecent($limit = self::DEFAULT_DATE_LIMIT)
    {
        return DB::table('entries')
            ->orderBy('date', 'desc')
            ->limit($limit)
            ->get();
    }

    public function getRecentWithMentions($limit = self::DEFAULT_DATE_LIMIT)
    {
        return Entry::with(['entryHasMention.mention'])
            ->orderBy('date', 'desc')
            ->limit($limit)
            ->get();
    }
}
