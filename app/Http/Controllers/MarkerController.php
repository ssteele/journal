<?php

namespace App\Http\Controllers;

use App\Models\Marker;
use App\Repositories\MarkerCategoryRepository;
use App\Repositories\MarkerRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MarkerController extends Controller
{
    private $markerCategoryRepository;
    private $markerRepository;

    /**
     * Create a new controller instance
     *
     * @return void
     */
    public function __construct(
        MarkerCategoryRepository $markerCategoryRepository,
        MarkerRepository $markerRepository,
    )
    {
        $this->middleware('auth');
        $this->markerCategoryRepository = $markerCategoryRepository;
        $this->markerRepository = $markerRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $markers = $this->markerRepository->get();
        $markerCategories = $this->markerCategoryRepository->get();
        return Inertia::render('Markers/Index')
            ->with('markerCategories', $markerCategories)
            ->with('markers', $markers);
    }

    // /**
    //  * Display the specified resource.
    //  *
    //  * @param  int  $id
    //  * @return \Illuminate\Http\Response
    //  */
    // public function show($id)
    // {
    //     $marker = Marker::find($id);
    //     return Inertia::render('Markers/Show')
    //         ->with('marker', $marker);
    // }

    // /**
    //  * Show the form for editing the specified resource.
    //  *
    //  * @param  int  $id
    //  * @return \Illuminate\Http\Response
    //  */
    // public function edit($id)
    // {
    //     //
    // }

    // /**
    //  * Update the specified resource in storage.
    //  *
    //  * @param  \Illuminate\Http\Request  $request
    //  * @param  int  $id
    //  * @return \Illuminate\Http\Response
    //  */
    // public function update(Request $request, $id)
    // {
    //     //
    // }

    // /**
    //  * Remove the specified resource from storage.
    //  *
    //  * @param  int  $id
    //  * @return \Illuminate\Http\Response
    //  */
    // public function destroy($id)
    // {
    //     //
    // }
}
