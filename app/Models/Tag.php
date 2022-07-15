<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'name',
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [];

    /**
     * Define the relationship between two eloquent models: Tag & User
     */
    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }

    /**
     * Define the relationship between two eloquent models: Tag & EntryHasTag
     */
    public function entryHasTag()
    {
        return $this->hasMany('App\Models\EntryHasTag');
    }
}
