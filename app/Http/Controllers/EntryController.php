<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEntryRequest;
// use App\Http\Requests\UpdateEntryRequest;
use App\Models\Entry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class EntryController extends Controller
{
    private $dateLimit = 28;
    // private $average = 0;
    // private $csvRows = [];
    // private $csvCounter = 0;

    /**
     * Create a new controller instance
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $entries = Entry::limit($this->dateLimit)->get();
        return Inertia::render('Entries/Index', ['entries' => $entries]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return Inertia::render('Entries/Create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreEntryRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreEntryRequest $request)
    {
        $entry = new Entry($request->all());
        $entity = \Auth::user()->entry()->save($entry);
        return redirect()->route('entries.update', $entity->id);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $entry = Entry::find($id);
        return Inertia::render('Entries/Show', ['entry' => $entry]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $entry = Entry::find($id);
        return Inertia::render('Entries/Edit', ['entry' => $entry]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\StoreEntryRequest  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(StoreEntryRequest $request, $id)
    {
        $entry = Entry::find($id);
        $update = new Entry($request->all());

        // update fillable fields (except user_id)
        $fillable = array_filter($update->getFillable(), function ($prop) {
            return $prop != 'user_id';
        });
        foreach ($fillable as $prop) {
            $entry->$prop = $update->$prop;
        }
    
        $entry->save();
        return redirect()->route('entries.update', $id);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
