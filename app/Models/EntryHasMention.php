<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EntryHasMention extends Model
{
    // /**
    //  * The database table used by the model
    //  *
    //  * @var string
    //  */
    // protected $table = 'entry_has_mentions';

    /**
     * The attributes that are mass assignable
     *
     * @var array
     */
    protected $fillable = [
        'entry_id',
        'mention_id',
    ];

    /**
     * The attributes excluded from the model's JSON form
     *
     * @var array
     */
    protected $hidden = [];

    /**
     * Indicates if the model should be timestamped
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * Define the relationship between two eloquent models: EntryHasMention & Entry
     */
    public function entry()
    {
        return $this->belongsTo('App\Models\Entry');
    }

    /**
     * Define the relationship between two eloquent models: EntryHasMention & Mention
     */
    public function mention()
    {
        return $this->belongsTo('App\Models\Mention');
    }
}
