<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use App\Repositories\TagRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SnippetController extends Controller
{
    private $tagRepository;

    /**
     * Create a new controller instance
     *
     * @return void
     */
    public function __construct(
        TagRepository $tagRepository,
    )
    {
        $this->middleware('auth');
        $this->tagRepository = $tagRepository;
    }

    /**
     * Display a listing of snippets.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $tags = $this->tagRepository->getSortedByFrequency();
        return Inertia::render('Snippets/Index')
            ->with('tags', $tags);
    }
}
