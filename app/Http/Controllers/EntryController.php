<?php
namespace App\Http\Controllers;

use App\Entry;
use App\Custom\LogDates;
use App\Custom\LogDatesDropdown;
use App\Custom\Tempo;
use App\Custom\TempoAverage;
use App\Http\Requests\EntryRequest;
use App\Http\Requests\EntryUploadRequest;
use Carbon\Carbon;

class EntryController extends Controller
{
    private $dateLimit = 28;
    private $average = 0;
    private $csvRows = [];
    private $csvCounter = 0;

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
     * Render the journal logging form
     *
     * @return Response
     */
    public function index()
    {
        // get unlogged dates
        $logDates = new LogDates($this->dateLimit);
        $logDatesDropdown = new LogDatesDropdown($logDates->get());
        $dates = $logDatesDropdown->create();

        return view('entry', compact('dates'));
    }

    /**
     * Render the bulk CSV upload form
     *
     * @return Response
     */
    public function upload()
    {
        return view('entry-upload');
    }

    /**
     * Calculate recent activity
     */
    private function calculateTempo()
    {
        // calculate tempo
        $tempo = new Tempo($this->dateLimit);
        $averageTempo = new TempoAverage($tempo->get());
        $this->average = $averageTempo->calculate();
    }

    /**
     * Redirect and flash recent activity
     *
     * @return Response
     */
    private function redirect()
    {
        // redirect and flash calculated tempo
        return redirect('')->with([
            'flash_message' => $this->average,
        ]);
    }

    /**
     * Save a journal entry
     *
     * @return Response
     */
    public function store(EntryRequest $request)
    {
        // save
        $entry = new Entry($request->all());
        \Auth::user()->entry()->save($entry);

        if (is_null($request->bulk)) {
            $this->calculateTempo();
            return $this->redirect();
        }
    }

    /**
     * Collect CSV upload rows
     * ...maatwebsite/excel package is over-encapsulated
     * @param  array $row    CSV row
     */
    private function collectCsvRow($row)
    {
        $this->csvRows[$this->csvCounter]['date'] = $row['date'];
        $this->csvRows[$this->csvCounter]['tempo'] = $row['tempo'];
        $this->csvRows[$this->csvCounter]['entry'] = $row['entry'];

        $this->csvCounter++;
    }

    /**
     * Use maatwebsite/excel package to extract CSV data
     * @param  object $csvUpload    File upload
     */
    private function extractCsvData($csvUpload)
    {
        $file = \Excel::load($csvUpload, function ($reader) {
            $reader->each(function ($row) {
                $this->collectCsvRow($row);
            });
        });
    }

    /**
     * Save several journal entries
     *
     * @return Response
     */
    public function bulkStore(EntryUploadRequest $request)
    {
        $csv = $request->input('csv');

        $csvUpload = $request->file('csv')->move(base_path() . '/public/', $csv);

        $this->extractCsvData($csvUpload);

        foreach ($this->csvRows as $row) {
            // pass through entry request validation/save methods
            $entryRequest = new EntryRequest;

            $entryRequest->replace([
                'user'  => \Auth::user(),
                'date'  => Carbon::createFromFormat('m.d.y', $row['date'])->toDateTimeString(),
                'tempo' => $row['tempo'],
                'entry' => $row['entry'],
                'bulk'  => true,
            ]);

            $entryRequest->setContainer(app());
            $entryRequest->validate();

            $this->store($entryRequest);
        }

        $this->calculateTempo();
        return $this->redirect();
    }
}
