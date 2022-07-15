<?php
namespace App\Services\Annotation;

use App\Services\Parser\AnnotationParser;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class MarkerAnnotation extends AbstractAnnotation
{
    /** @var string */
    private $type = 'marker';

    /** @var string */
    private $regex = '/\<([^\>]+)\>/';

    public function __construct()
    {
        $this->setRegex($this->regex);
        $this->setParser(new AnnotationParser($this));
    }

    /**
     * Parse markers once again to sort into marker categories
     * @param  array  $markers          Markers parsed from entries
     * @param  array  $markerCategories Marker category entities
     * @return array                    Nested array of markers within categories
     */
    public function assignMarkersToCategories(array $markers = [], array|Collection $markerCategories = [])
    {
        $originalMarkers = $markers;
        $categorizedMarkers = [];

        foreach ($markerCategories as $markerCategory) {
            foreach ($markers as $markerId => $marker) {
                $match = null;

                // splice default marker that does not require an explicit annotation
                if ($markerCategory->is_default && ! preg_match('/^\w+: (.+)/', $marker)) {
                    if (preg_match('/^(.+)/', $marker, $matches)) {
                        $match = array_pop($matches);
                    }
                // splice marker annotated using shorthand
                } elseif (preg_match('/^' . $markerCategory->shorthand . ': (.+)/', $marker, $matches)) {
                    $match = array_pop($matches);
                // splice marker annotated using full name
                } elseif (preg_match('/^' . $markerCategory->name . ': (.+)/', $marker, $matches)) {
                    $match = array_pop($matches);
                }

                if ($match) {
                    $categorizedMarkers[$markerCategory->id][] = $match;
                    unset($markers[$markerId]);
                }
            }
        }

        // verify all markers have been assigned
        $originalMarkerCount = count($originalMarkers);
        $categorizedMarkerCount = count($categorizedMarkers, COUNT_RECURSIVE) - count($categorizedMarkers);
        if (! empty($markers) || $originalMarkerCount != $categorizedMarkerCount) {
            if (! \App::runningUnitTests()) {                       // @TODO: RuntimeException: Session store not set on request.
                $request = app(Request::class);
                $request->session()->flash('flash_marker', $markers);
            }
        }

        return $categorizedMarkers;
    }
}
