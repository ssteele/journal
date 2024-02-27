<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ExportEntryRequest extends FormRequest
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
            'startDate'  => 'date',
            'endDate'  => 'date',
        ];
    }
}
