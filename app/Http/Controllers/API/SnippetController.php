<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Snippet;
use Illuminate\Http\Request;

class SnippetController extends Controller
{
    /**
     * Reorder snippets
     *
     * @param  \Illuminate\Http\Request  $request
     */
    public function updateOrder(Request $request)
    {
        $user = \Auth::user();

        $idsOrders = $request->input('idsOrders');
        foreach ($idsOrders as $idOrder) {
            $snippet = Snippet::where('id', $idOrder['id'])
                ->where('user_id', $user->id)
                ->firstOrFail();
            $snippet->order = $idOrder['order'];
            $snippet->save();
        }

        return response()->json([ 'message' => 'Snippets reordered' ]);
    }
}