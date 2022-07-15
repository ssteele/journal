<?php
namespace App\Services\Annotation;

use App\Services\Parser\ParserInterface;

interface AnnotationInterface
{
    public function getEntry();
    public function getRegex();
    public function extract();
    public function process(array $annotations);
}
