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
            try {
                $snippet = Snippet::where('id', $idOrder['id'])
                    ->where('user_id', $user->id)
                    ->firstOrFail();
                $snippet->order = $idOrder['order'];
                $snippet->save();
            } catch (\Exception $e) {
                return response('Unable to update snippet order', 422);
            }
        }

        return response()->json([ 'message' => 'Snippets reordered' ]);
    }
}
