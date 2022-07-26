<?php

namespace App\Console\Commands;

use App\Models\Entry;
use Illuminate\Console\Command;

class BackfillDatabase extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'backfill:database';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Run data backfills';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $entries = Entry::all();
        // $entries = Entry::where('id', '>=', '3930')
        //     ->where('id', '<=', '3934')
        //     ->take(10)
        //     ->get();
        // $entry = Entry::find(3934);

        foreach ($entries as $entry) {
            echo "\n"; echo "id: "; echo $entry->id;
            $entry->entry = preg_replace('/;/', "\n\n", $entry->entry);
            $entry->save();
        }
        
        echo "\n\n";

        return 0;
    }
}
