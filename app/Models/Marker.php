<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Marker extends Model
{
    // /**
    //  * The database table used by the model.
    //  *
    //  * @var string
    //  */
    // protected $table = 'markers';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'marker_category_id',
        'entry_id',
        'marker',
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [];

    /**
     * Define the relationship between two eloquent models: Marker & MarkerCategory
     */
    public function markerCategory()
    {
        return $this->belongsTo('App\Models\MarkerCategory');
    }

    /**
     * Define the relationship between two eloquent models: Marker & Entry
     */
    public function entry()
    {
        return $this->belongsTo('App\Models\Entry');
    }
}
