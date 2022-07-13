<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEntryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        // @todo: use policy to handle multiple users
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'date'  => 'required | date',
            // 'date'  => 'required | date | unique:entries', // @todo: not sure - this is update method
            'tempo' => 'required | numeric',
            'entry' => 'required',
        ];
    }
}
