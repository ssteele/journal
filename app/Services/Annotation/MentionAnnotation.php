<?php
namespace App\Services\Annotation;

use App\Services\Parser\AnnotationParser;

class MentionAnnotation extends AbstractAnnotation
{
    /** @var string */
    private $type = 'mention';

    /** @var string */
    private $regex = '/\@([a-z]+)/';

    public function __construct()
    {
        $this->setRegex($this->regex);
        $this->setParser(new AnnotationParser($this));
    }

    /**
     * Post-processing of annotations after parsing from entry
     * @return array    Annotations
     */
    public function process(array $annotations)
    {
        return $this->removeDuplicates($annotations);
    }
}
