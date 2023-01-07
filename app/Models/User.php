<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Define the relationship between two eloquent models: User & Entry
     */
    public function entry()
    {
        return $this->hasMany('App\Models\Entry');
    }

    /**
     * Define the relationship between two eloquent models: User & Tag
     */
    public function tag()
    {
        return $this->hasMany('App\Models\Tag');
    }

    /**
     * Define the relationship between two eloquent models: User & Mention
     */
    public function mention()
    {
        return $this->hasMany('App\Models\Mention');
    }

    /**
     * Define the relationship between two eloquent models: User & Snippet
     */
    public function snippet()
    {
        return $this->hasMany('App\Models\Snippet');
    }
}
