<?php
namespace App\Services\Parser;

use App\Services\Annotation\AnnotationInterface;

class AnnotationParser implements ParserInterface
{
    /** @var object */
    private $annotation;

    public function __construct($annotation)
    {
        $this->setAnnotation($annotation);
    }

    public function setAnnotation(AnnotationInterface $annotation)
    {
        $this->annotation = $annotation;
    }

    /**
     * Parse annotations from an entry
     * @return array    Annotations or empty array if none found
     */
    public function parse()
    {
        $string = $this->annotation->getEntry();
        $regex = $this->annotation->getRegex();
        preg_match_all($regex, $string, $matches);

        return array_pop($matches);
    }
}
