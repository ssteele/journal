<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MarkerCategory extends Model
{
    // /**
    //  * The database table used by the model.
    //  *
    //  * @var string
    //  */
    // protected $table = 'marker_categories';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'name',
        'shorthand',
        'is_default',
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [];

    /**
     * Define the relationship between two eloquent models: MarkerCategory & Marker
     */
    public function marker()
    {
        return $this->hasMany('App\Models\Marker');
    }
}
