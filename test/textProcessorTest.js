
describe("Text Processor", function() {

    it('Should change word into object', function() {

        var expected = [
        {name : 'Hello', x : 0, y : 0, color : 'steelblue', link: [] }
        ];

        expect(textProcessor('Hello')).toEqual(expected);
    });

    it('Should change sentences per line into object', function() {

        var expected = [
        {name : 'Hello', x : 0, y : 0, color : 'steelblue', link: [] },
        {name : 'Hi', x : 0, y : 1, color : 'steelblue', link: [] }
        ];
        expect(textProcessor('Hello\nHi')).toEqual(expected);

    });

    it('Should set the color after change this?', function() {
        var expected = [
        {name : 'Hello', x : 0, y : 0, color : 'steelblue', link: [] },
        {name : 'Hi', x : 0, y : 1, color : 'steelblue', link: [] },
        {name : 'TestColor', x : 0, y : 2, color : 'red', link : [] },
        {name : 'TestColor2', x : 0, y : 3, color : 'red', link : [] }
        ];
        expect(textProcessor('Hello\nHi\nTestColor|red\nTestColor2|red')).toEqual(expected);
    });

    it('Should layouting welll with hor statement?', function() {
        var expected = [
        {name : 'Pos1', x : 0, y : 0, color : 'steelblue', link: [] },
        {name : 'Pos2', x : 1, y : 0, color : 'steelblue', link: [] },
        {name : 'Pos3', x : 2, y : 0, color : 'steelblue', link: [] },
        {name : 'Pos4', x : 3, y : 0, color : 'steelblue', link: [] },
        ];
        //expect(textProcessor('Pos1;0;0|hor\nPos2\nPos3\nPos4')).toEqual(expected);

    });

