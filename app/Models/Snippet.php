<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Snippet extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'description',
        'type',
        'snippet',
        'days',
        'repeating',
        'enabled',
        'deleted',
    ];

    // /**
    //  * The attributes that should be hidden for serialization.
    //  *
    //  * @var array<int, string>
    //  */
    // protected $hidden = [
    //     'date',
    // ];

    /**
     * Define the relationship between two eloquent models: Snippet & User
     */
    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }
}
