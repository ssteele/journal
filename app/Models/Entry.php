<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Entry extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'date',
        'tempo',
        'entry',
        'enabled',
        'deleted',
    ];

    /**
     * Set implicit route model binding: Entry is fetched by date, not id
     */
    public function getRouteKeyName()
    {
        return 'date';
    }

    /**
     * Define the relationship between two eloquent models: Entry & User
     */
    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }

    /**
     * Define the relationship between two eloquent models: Entry & EntryHasTag
     */
    public function entryHasTag()
    {
        return $this->hasMany('App\Models\EntryHasTag');
    }

    /**
     * Define the relationship between two eloquent models: Entry & EntryHasTag
     */
    public function entryHasMention()
    {
        return $this->hasMany('App\Models\EntryHasMention');
    }

    /**
     * Define the relationship between two eloquent models: Entry & Marker
     */
    public function marker()
    {
        return $this->hasMany('App\Models\Marker');
    }
}
