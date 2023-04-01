<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Entry;
// use App\Repositories\EntryRepository;
// use Illuminate\Http\Request;

class EntryController extends Controller
{
    // private $entryRepository;

    /**
     * Create a new controller instance
     *
     * @return void
     */
    public function __construct(
        // EntryRepository $entryRepository,
    )
    {
        // $this->middleware('auth');                               // @todo: handle auth
        // $this->entryRepository = $entryRepository;
    }

    /**
     * Get entry by id.
     *
     * @param  int  $id
     * @return any? // @todo
     */
    public function get($id)
    {
        $entry = Entry::find($id);
        // dd($entry);
        return response()->json($entry);
    }
}
