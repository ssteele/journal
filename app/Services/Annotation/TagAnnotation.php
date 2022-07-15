<?php
namespace App\Services\Annotation;

use App\Services\Parser\AnnotationParser;

class TagAnnotation extends AbstractAnnotation
{
    /** @var string */
    private $type = 'tag';

    /** @var string */
    private $regex = '/\#(\w+)/';

    public function __construct()
    {
        $this->setRegex($this->regex);
        $this->setParser(new AnnotationParser($this));
    }
}
