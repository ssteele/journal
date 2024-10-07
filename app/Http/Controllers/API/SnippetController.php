<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Snippet;
use Illuminate\Http\Request;
// use App\Repositories\SnippetRepository;

class SnippetController extends Controller
{
    // private $snippetRepository;

    /**
     * Create a new controller instance
     *
     * @return void
     */
    public function __construct(
        // SnippetRepository $snippetRepository,
    )
    {
        // $this->middleware('auth');
        // $this->snippetRepository = $snippetRepository;
    }

    /**
     * Reorder snippets
     *
     * @param  \Illuminate\Http\Request  $request
     */
    public function updateOrder(Request $request)
    {
        $idsOrders = $request->input('idsOrders');
        foreach ($idsOrders as $idOrder) {
            $snippet = Snippet::find($idOrder['id']);
            $snippet->order = $idOrder['order'];
            $snippet->save();
        }

        return response()->json([ 'message' => 'Snippets reordered' ]);
    }
}
