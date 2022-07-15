<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mention extends Model
{
    // /**
    //  * The database table used by the model.
    //  *
    //  * @var string
    //  */
    // protected $table = 'mentions';

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
     * Define the relationship between two eloquent models: Mention & User
     */
    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }

    /**
     * Define the relationship between two eloquent models: Mention & EntryHasMention
     */
    public function entryHasMention()
    {
        return $this->hasMany('App\Models\EntryHasMention');
    }
}
