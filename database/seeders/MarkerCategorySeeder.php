<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MarkerCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $markerCategories = [
            [
                'user_id' => 1,
                'name' => 'feeling',
                'shorthand' => '',
                'is_default' => '1',
            ],
            [
                'user_id' => 1,
                'name' => 'health',
                'shorthand' => 'h',
                'is_default' => '0',
            ],
            [
                'user_id' => 1,
                'name' => 'milestone',
                'shorthand' => 'm',
                'is_default' => '0',
            ],
            [
                'user_id' => 1,
                'name' => 'event',
                'shorthand' => 'e',
                'is_default' => '0',
            ],
            [
                'user_id' => 1,
                'name' => 'funny',
                'shorthand' => 'f',
                'is_default' => '0',
            ],
            [
                'user_id' => 1,
                'name' => 'idea',
                'shorthand' => 'i',
                'is_default' => '0',
            ],
            [
                'user_id' => 1,
                'name' => 'fight',
                'shorthand' => 'x',
                'is_default' => '0',
            ],
            [
                'user_id' => 1,
                'name' => 'session',
                'shorthand' => 's',
                'is_default' => '0',
            ],
            [
                'user_id' => 1,
                'name' => 'dream',
                'shorthand' => 'd',
                'is_default' => '0',
            ],
            [
                'user_id' => 1,
                'name' => 'typical',
                'shorthand' => 't',
                'is_default' => '0',
            ],
            [
                'user_id' => 1,
                'name' => 'note',
                'shorthand' => 'n',
                'is_default' => '0',
            ],
            [
                'user_id' => 1,
                'name' => 'kids',
                'shorthand' => 'k',
                'is_default' => '0',
            ],
            [
                'user_id' => 1,
                'name' => 'work',
                'shorthand' => 'w',
                'is_default' => '0',
            ],
        ];

        \DB::table('marker_categories')->insert($markerCategories);
    }
}
