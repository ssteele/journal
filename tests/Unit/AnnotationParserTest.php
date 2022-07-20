<?php

namespace Tests\Unit;

use App\Services\Annotation\MarkerAnnotation;
use App\Services\Annotation\MentionAnnotation;
use App\Services\Annotation\TagAnnotation;
use App\Services\Parser\AnnotationParser;
use PHPUnit\Framework\TestCase;

class AnnotationParserTest extends TestCase
{
    private $tagAnnotation;
    private $mentionAnnotation;
    private $markerAnnotation;

    private function prepareTags($input)
    {
        $this->tagAnnotation = new TagAnnotation();
        $this->tagAnnotation->setEntry($input);
    }

    private function prepareMentions($input)
    {
        $this->mentionAnnotation = new MentionAnnotation();
        $this->mentionAnnotation->setEntry($input);
    }

    private function prepareMarkers($input)
    {
        $this->markerAnnotation = new MarkerAnnotation();
        $this->markerAnnotation->setEntry($input);
    }

    private function getMarkerCategories()
    {
        return [
            (object) [
                'id' => 1,
                'name' => 'feeling',
                'shorthand' => 'f',
                'is_default' => 1,
            ],
            (object) [
                'id' => 2,
                'name' => 'health',
                'shorthand' => 'h',
                'is_default' => 0,
            ],
            (object) [
                'id' => 3,
                'name' => 'milestone',
                'shorthand' => 'm',
                'is_default' => 0,
            ],
            (object) [
                'id' => 4,
                'name' => 'event',
                'shorthand' => 'e',
                'is_default' => 0,
            ],
            (object) [
                'id' => 5,
                'name' => 'idea',
                'shorthand' => 'i',
                'is_default' => 0,
            ],
        ];
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // tags
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    public function testOneTag()
    {
        $input = 'lorem #foo ipsum';
        $expected = ['foo'];

        $this->prepareTags($input);
        $this->assertEquals($expected, $this->tagAnnotation->extract());
    }

    public function testTwoTags()
    {
        $input = 'lorem #foo ipsum #bar dolor';
        $expected = ['foo', 'bar'];

        $this->prepareTags($input);
        $this->assertEquals($expected, $this->tagAnnotation->extract());
    }

    public function testThreeTags()
    {
        $input = 'lorem #foo ipsum #bar #baz dolor';
        $expected = ['foo', 'bar', 'baz'];

        $this->prepareTags($input);
        $this->assertEquals($expected, $this->tagAnnotation->extract());
    }

    public function testDuplicateTags()
    {
        $input = 'lorem #foo ipsum #bar #foo dolor';
        $expected = ['foo', 'bar', 'foo'];

        $this->prepareTags($input);
        $this->assertEquals($expected, $this->tagAnnotation->extract());
    }

    public function testLoremIpsumTags()
    {
        $input = 'Excepteur cillum nisi consectetur do esse <@eiusmod adipisicing dolor> id #laboris anim in laborum ex sed dolor et; Lorem ipsum dolore nostrud occaecat quis ex minim id aliqua proident nulla culpa excepteur, @Lorem ipsum quis officia reprehenderit amet ut sed incididunt elit quis in id nisi nostrud aute aliqua in, Ea sunt dolore cillum eu exercitation sunt ad eu laboris ut <m: nulla minim>, Ad velit in exercitation #excepteur eu in quis minim deserunt et amet <i: exercitation dolor deserunt> occaecat cillum; Occaecat ut cillum tempor incididunt elit dolore mollit cillum cupidatat minim adipisicing consectetur sunt sed nostrud, Nisi eu amet quis sint id ad enim esse aliqua mollit eu dolor non in minim qui, Occaecat eu culpa #sint mollit <h: sint id eiusmod> in ut elit; @Lorem ipsum voluptate non dolore ea commodo ut ullamco non velit @elit nostrud non irure sunt veniam <cillum sit occaecat id>. Ex cillum voluptate enim nulla velit magna sint voluptate voluptate in aliqua cillum! Lorem ipsum pariatur <e: #laboris excepteur dolor in> voluptate pariatur non incididunt culpa velit, Lorem ipsum fugiat reprehenderit do dolor nulla incididunt in elit tempor dolore dolore adipisicing <m: aliqua laborum deserunt> tempor voluptate excepteur minim; Aliquip commodo #sint et consectetur labore in adipisicing <nulla sed dolore> <reprehenderit veniam cupidatat> ad non irure non do, Voluptate veniam qui reprehenderit ullamco sed ut officia ut sed ex qui proident magna incididunt, <i: Tempor deserunt veniam> proident commodo sunt consequat laborum laboris <h: reprehenderit magna occaecat> sunt; Sit dolor ut in sit sed deserunt <e: officia amet aute>, Dolor ut non consectetur dolor @eiusmod id pariatur fugiat esse occaecat culpa tempor qui ut, Dolore voluptate magna amet ut amet aliquip reprehenderit culpa proident ullamco in est; Culpa ea qui aute ut nulla et in culpa ut, Non tempor occaecat esse #sint labore esse veniam ad amet est ullamco, @Lorem ipsum magna voluptate exercitation veniam #duis et non deserunt eiusmod in @amet velit nostrud';
        $expected = ['laboris', 'excepteur', 'sint', 'laboris', 'sint', 'sint', 'duis'];

        $this->prepareTags($input);
        $this->assertEquals($expected, $this->tagAnnotation->extract());
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // mentions
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    public function testOneMention()
    {
        $input = 'lorem @foo ipsum';
        $expected = ['foo'];

        $this->prepareMentions($input);
        $this->assertEquals($expected, $this->mentionAnnotation->extract());
    }

    public function testTwoMentions()
    {
        $input = 'lorem @foo ipsum @bar dolor';
        $expected = ['foo', 'bar'];

        $this->prepareMentions($input);
        $this->assertEquals($expected, $this->mentionAnnotation->extract());
    }

    public function testThreeMentions()
    {
        $input = 'lorem @foo ipsum @bar @baz dolor';
        $expected = ['foo', 'bar', 'baz'];

        $this->prepareMentions($input);
        $this->assertEquals($expected, $this->mentionAnnotation->extract());
    }

    public function testDuplicateMentions()
    {
        $input = 'lorem @foo ipsum @bar @foo dolor';
        $expected = ['foo', 'bar'];

        $this->prepareMentions($input);
        $this->assertEquals($expected, $this->mentionAnnotation->extract());
    }

    public function testLoremIpsumMentions()
    {
        $input = 'Excepteur cillum nisi consectetur do esse <@eiusmod adipisicing dolor> id #laboris anim in laborum ex sed dolor et; Lorem ipsum dolore nostrud occaecat quis ex minim id aliqua proident nulla culpa excepteur, @Lorem ipsum quis officia reprehenderit amet ut sed incididunt elit quis in id nisi nostrud aute aliqua in, Ea sunt dolore cillum eu exercitation sunt ad eu laboris ut <m: nulla minim>, Ad velit in exercitation #excepteur eu in quis minim deserunt et amet <i: exercitation dolor deserunt> occaecat cillum; Occaecat ut cillum tempor incididunt elit dolore mollit cillum cupidatat minim adipisicing consectetur sunt sed nostrud, Nisi eu amet quis sint id ad enim esse aliqua mollit eu dolor non in minim qui, Occaecat eu culpa #sint mollit <h: sint id eiusmod> in ut elit; @Lorem ipsum voluptate non dolore ea commodo ut ullamco non velit @elit nostrud non irure sunt veniam <cillum sit occaecat id>. Ex cillum voluptate enim nulla velit magna sint voluptate voluptate in aliqua cillum! Lorem ipsum pariatur <e: #laboris excepteur dolor in> voluptate pariatur non incididunt culpa velit, Lorem ipsum fugiat reprehenderit do dolor nulla incididunt in elit tempor dolore dolore adipisicing <m: aliqua laborum deserunt> tempor voluptate excepteur minim; Aliquip commodo #sint et consectetur labore in adipisicing <nulla sed dolore> <reprehenderit veniam cupidatat> ad non irure non do, Voluptate veniam qui reprehenderit ullamco sed ut officia ut sed ex qui proident magna incididunt, <i: Tempor deserunt veniam> proident commodo sunt consequat laborum laboris <h: reprehenderit magna occaecat> sunt; Sit dolor ut in sit sed deserunt <e: officia amet aute>, Dolor ut non consectetur dolor @eiusmod id pariatur fugiat esse occaecat culpa tempor qui ut, Dolore voluptate magna amet ut amet aliquip reprehenderit culpa proident ullamco in est; Culpa ea qui aute ut nulla et in culpa ut, Non tempor occaecat esse #sint labore esse veniam ad amet est ullamco, @Lorem ipsum magna voluptate exercitation veniam #duis et non deserunt eiusmod in @amet velit nostrud';
        $expected = ['eiusmod', 'elit', 'amet'];

        $this->prepareMentions($input);
        $this->assertEquals($expected, $this->mentionAnnotation->extract());
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // markers
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    public function testOneDefaultMarker()
    {
        $input = 'lorem <foo> ipsum';
        $expected = ['foo'];

        $this->prepareMarkers($input);
        $markers = $this->markerAnnotation->extract();
        $this->assertEquals($expected, $markers);

        $expected = [1 => ['foo']];
        $this->assertEquals($expected, $this->markerAnnotation->assignMarkersToCategories($markers, $this->getMarkerCategories()));
    }

    public function testTwoDefaultMarkers()
    {
        $input = 'lorem <foo> ipsum <bar> dolor';
        $expected = ['foo', 'bar'];

        $this->prepareMarkers($input);
        $markers = $this->markerAnnotation->extract();
        $this->assertEquals($expected, $markers);

        $expected = [1 => ['foo', 'bar']];
        $this->assertEquals($expected, $this->markerAnnotation->assignMarkersToCategories($markers, $this->getMarkerCategories()));
    }

    public function testThreeDefaultMarkers()
    {
        $input = 'lorem <foo> ipsum <bar> <baz> dolor';
        $expected = ['foo', 'bar', 'baz'];

        $this->prepareMarkers($input);
        $markers = $this->markerAnnotation->extract();
        $this->assertEquals($expected, $markers);

        $expected = [1 => ['foo', 'bar', 'baz']];
        $this->assertEquals($expected, $this->markerAnnotation->assignMarkersToCategories($markers, $this->getMarkerCategories()));
    }

    public function testOneShorthandMarker()
    {
        $input = 'lorem <f: foo> ipsum';
        $expected = ['f: foo'];

        $this->prepareMarkers($input);
        $markers = $this->markerAnnotation->extract();
        $this->assertEquals($expected, $markers);

        $expected = [1 => ['foo']];
        $this->assertEquals($expected, $this->markerAnnotation->assignMarkersToCategories($markers, $this->getMarkerCategories()));
    }

    public function testTwoSameShorthandMarkers()
    {
        $input = 'lorem <e: foo> ipsum <e: bar> dolor';
        $expected = ['e: foo', 'e: bar'];

        $this->prepareMarkers($input);
        $markers = $this->markerAnnotation->extract();
        $this->assertEquals($expected, $markers);

        $expected = [4 => ['foo', 'bar']];
        $this->assertEquals($expected, $this->markerAnnotation->assignMarkersToCategories($markers, $this->getMarkerCategories()));
    }

    public function testThreeSameShorthandMarkers()
    {
        $input = 'lorem <h: foo> ipsum <h: bar> <h: baz> dolor';
        $expected = ['h: foo', 'h: bar', 'h: baz'];

        $this->prepareMarkers($input);
        $markers = $this->markerAnnotation->extract();
        $this->assertEquals($expected, $markers);

        $expected = [2 => ['foo', 'bar', 'baz']];
        $this->assertEquals($expected, $this->markerAnnotation->assignMarkersToCategories($markers, $this->getMarkerCategories()));
    }

    public function testOneNamedMarker()
    {
        $input = 'lorem <feeling: foo> ipsum';
        $expected = ['feeling: foo'];

        $this->prepareMarkers($input);
        $markers = $this->markerAnnotation->extract();
        $this->assertEquals($expected, $markers);

        $expected = [1 => ['foo']];
        $this->assertEquals($expected, $this->markerAnnotation->assignMarkersToCategories($markers, $this->getMarkerCategories()));
    }

    public function testTwoSameNamedMarkers()
    {
        $input = 'lorem <event: foo> ipsum <event: bar> dolor';
        $expected = ['event: foo', 'event: bar'];

        $this->prepareMarkers($input);
        $markers = $this->markerAnnotation->extract();
        $this->assertEquals($expected, $markers);

        $expected = [4 => ['foo', 'bar']];
        $this->assertEquals($expected, $this->markerAnnotation->assignMarkersToCategories($markers, $this->getMarkerCategories()));
    }

    public function testThreeSameNamedMarkers()
    {
        $input = 'lorem <health: foo> ipsum <health: bar> <health: baz> dolor';
        $expected = ['health: foo', 'health: bar', 'health: baz'];

        $this->prepareMarkers($input);
        $markers = $this->markerAnnotation->extract();
        $this->assertEquals($expected, $markers);

        $expected = [2 => ['foo', 'bar', 'baz']];
        $this->assertEquals($expected, $this->markerAnnotation->assignMarkersToCategories($markers, $this->getMarkerCategories()));
    }

    public function testMixedDefaultShorthandMarkers()
    {
        $input = 'lorem <foo> <f: bar> ipsum';
        $expected = ['foo', 'f: bar'];

        $this->prepareMarkers($input);
        $markers = $this->markerAnnotation->extract();
        $this->assertEquals($expected, $markers);

        $expected = [1 => ['foo', 'bar']];
        $this->assertEquals($expected, $this->markerAnnotation->assignMarkersToCategories($markers, $this->getMarkerCategories()));
    }

    public function testMixedDefaultShorthandNamedMarkers()
    {
        $input = 'lorem <foo> <f: bar> ipsum <feeling: baz>';
        $expected = ['foo', 'f: bar', 'feeling: baz'];

        $this->prepareMarkers($input);
        $markers = $this->markerAnnotation->extract();
        $this->assertEquals($expected, $markers);

        $expected = [1 => ['foo', 'bar', 'baz']];
        $this->assertEquals($expected, $this->markerAnnotation->assignMarkersToCategories($markers, $this->getMarkerCategories()));
    }

    public function testTwoDifferentShorthandMarkers()
    {
        $input = 'lorem <h: foo> ipsum <m: bar> dolor';
        $expected = ['h: foo', 'm: bar'];

        $this->prepareMarkers($input);
        $markers = $this->markerAnnotation->extract();
        $this->assertEquals($expected, $markers);

        $expected = [2 => ['foo'], 3 => ['bar']];
        $this->assertEquals($expected, $this->markerAnnotation->assignMarkersToCategories($markers, $this->getMarkerCategories()));
    }

    public function testThreeDifferentShorthandMarkers()
    {
        $input = 'lorem <h: foo> ipsum <i: bar> <f: baz> dolor';
        $expected = ['h: foo', 'i: bar', 'f: baz'];

        $this->prepareMarkers($input);
        $markers = $this->markerAnnotation->extract();
        $this->assertEquals($expected, $markers);

        $expected = [1 => ['baz'], 2 => ['foo'], 5 => ['bar']];
        $this->assertEquals($expected, $this->markerAnnotation->assignMarkersToCategories($markers, $this->getMarkerCategories()));
    }

    public function testTwoDifferentMultipleShorthandMarkers()
    {
        $input = 'lorem <e: foo> ipsum <m: bar> <m: baz> dolor <e: qux>';
        $expected = ['e: foo', 'm: bar', 'm: baz', 'e: qux'];

        $this->prepareMarkers($input);
        $markers = $this->markerAnnotation->extract();
        $this->assertEquals($expected, $markers);

        $expected = [3 => ['bar', 'baz'], 4 => ['foo', 'qux']];
        $this->assertEquals($expected, $this->markerAnnotation->assignMarkersToCategories($markers, $this->getMarkerCategories()));
    }

    public function testThreeDifferentMultipleShorthandMarkers()
    {
        $input = 'lorem <i: foo> ipsum <i: bar> <f: baz> <i: qux> dolor <h: quux> <f: quuz> lorem <h: corge>';
        $expected = ['i: foo', 'i: bar', 'f: baz', 'i: qux', 'h: quux', 'f: quuz', 'h: corge'];

        $this->prepareMarkers($input);
        $markers = $this->markerAnnotation->extract();
        $this->assertEquals($expected, $markers);

        $expected = [1 => ['baz', 'quuz'], 2 => ['quux', 'corge'], 5 => ['foo', 'bar', 'qux']];
        $this->assertEquals($expected, $this->markerAnnotation->assignMarkersToCategories($markers, $this->getMarkerCategories()));
    }

    public function testThreeDifferentMultipleMixedMarkers()
    {
        $input = '<feeling: fo> lorem <i: foo> ipsum <i: bar> <f: baz> <i: qux> dolor <h: quux> <quuz> lorem <h: corge>';
        $expected = ['feeling: fo', 'i: foo', 'i: bar', 'f: baz', 'i: qux', 'h: quux', 'quuz', 'h: corge'];

        $this->prepareMarkers($input);
        $markers = $this->markerAnnotation->extract();
        $this->assertEquals($expected, $markers);

        $expected = [1 => ['fo', 'baz', 'quuz'], 2 => ['quux', 'corge'], 5 => ['foo', 'bar', 'qux']];
        $this->assertEquals($expected, $this->markerAnnotation->assignMarkersToCategories($markers, $this->getMarkerCategories()));
    }

    public function testAsAboveWithUndefinedMarkers()
    {
        $input = '<feeling: fo> lorem <i: foo> ipsum <y: bar> <f: baz> <i: qux> dolor <z: quux> <quuz> lorem <h: corge>';
        $expected = ['feeling: fo', 'i: foo', 'y: bar', 'f: baz', 'i: qux', 'z: quux', 'quuz', 'h: corge'];

        $this->prepareMarkers($input);
        $markers = $this->markerAnnotation->extract();
        $this->assertEquals($expected, $markers);

        $expected = [1 => ['fo', 'baz', 'quuz'], 2 => ['corge'], 5 => ['foo', 'qux']];
        $this->assertEquals($expected, $this->markerAnnotation->assignMarkersToCategories($markers, $this->getMarkerCategories()));
    }

    public function testLoremIpsumMarkers()
    {
        $input = 'Excepteur cillum nisi consectetur do esse <@eiusmod adipisicing dolor> id #laboris anim in laborum ex sed dolor et; Lorem ipsum dolore nostrud occaecat quis ex minim id aliqua proident nulla culpa excepteur, @Lorem ipsum quis officia reprehenderit amet ut sed incididunt elit quis in id nisi nostrud aute aliqua in, Ea sunt dolore cillum eu exercitation sunt ad eu laboris ut <m: nulla minim>, Ad velit in exercitation #excepteur eu in quis minim deserunt et amet <i: exercitation dolor deserunt> occaecat cillum; Occaecat ut cillum tempor incididunt elit dolore mollit cillum cupidatat minim adipisicing consectetur sunt sed nostrud, Nisi eu amet quis sint id ad enim esse aliqua mollit eu dolor non in minim qui, Occaecat eu culpa #sint mollit <h: sint id eiusmod> in ut elit; @Lorem ipsum voluptate non dolore ea commodo ut ullamco non velit @elit nostrud non irure sunt veniam <cillum sit occaecat id>. Ex cillum voluptate enim nulla velit magna sint voluptate voluptate in aliqua cillum! Lorem ipsum pariatur <e: #laboris excepteur dolor in> voluptate pariatur non incididunt culpa velit, Lorem ipsum fugiat reprehenderit do dolor nulla incididunt in elit tempor dolore dolore adipisicing <m: aliqua laborum deserunt> tempor voluptate excepteur minim; Aliquip commodo #sint et consectetur labore in adipisicing <nulla sed dolore> <reprehenderit veniam cupidatat> ad non irure non do, Voluptate veniam qui reprehenderit ullamco sed ut officia ut sed ex qui proident magna incididunt, <i: Tempor deserunt veniam> proident commodo sunt consequat laborum laboris <h: reprehenderit magna occaecat> sunt; Sit dolor ut in sit sed deserunt <e: officia amet aute>, Dolor ut non consectetur dolor @eiusmod id pariatur fugiat esse occaecat culpa tempor qui ut, Dolore voluptate magna amet ut amet aliquip reprehenderit culpa proident ullamco in est; Culpa ea qui aute ut nulla et in culpa ut, Non tempor occaecat esse #sint labore esse veniam ad amet est ullamco, @Lorem ipsum magna voluptate exercitation veniam #duis et non deserunt eiusmod in @amet velit nostrud';
        $expected = ['@eiusmod adipisicing dolor', 'm: nulla minim', 'i: exercitation dolor deserunt', 'h: sint id eiusmod', 'cillum sit occaecat id', 'e: #laboris excepteur dolor in', 'm: aliqua laborum deserunt', 'nulla sed dolore', 'reprehenderit veniam cupidatat', 'i: Tempor deserunt veniam', 'h: reprehenderit magna occaecat', 'e: officia amet aute'];

        $this->prepareMarkers($input);
        $markers = $this->markerAnnotation->extract();
        $this->assertEquals($expected, $markers);

        $expected = [
            1 => ['@eiusmod adipisicing dolor', 'cillum sit occaecat id', 'nulla sed dolore', 'reprehenderit veniam cupidatat'],
            2 => ['sint id eiusmod', 'reprehenderit magna occaecat'],
            3 => ['nulla minim', 'aliqua laborum deserunt'],
            4 => ['#laboris excepteur dolor in', 'officia amet aute'],
            5 => ['exercitation dolor deserunt', 'Tempor deserunt veniam'],
        ];
        $this->assertEquals($expected, $this->markerAnnotation->assignMarkersToCategories($markers, $this->getMarkerCategories()));
    }
}
