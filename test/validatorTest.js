describe('Validator', function() {

    var v;
    beforeEach(function() {
        v = new Validator();
    });
    
    it('should able to validate String', function() {
        var a = new String();
        expect(v.isString(a)).toBe(true);
        expect(v.isString("Hello")).toBe(true);
        expect(v.isString({})).toBe(false);
        expect(v.isString([])).toBe(false);
        expect(v.isString(100)).toBe(false);
    });

    it('should able to validate Object', function() {
        expect(v.isObject({})).toBe(true);
        expect(v.isObject([])).toBe(false);
        expect(v.isObject("Hallo")).toBe(false);
    });

    it('should able to validate input object', function() {
        var data_1 = { id : 'Hello', x : 0, y : 1};
        var false_data_1 = { id : [], x : 0, y : 1};
        var false_data_2 = { id : 'one_1', x : 0 };
        var false_data_3 = { id : 'one_2', y : 1};

        expect(v.isValidInputObject(data_1)).toBe(true);
        expect(v.isValidInputObject(false_data_1)).toBe(false);
        expect(v.isValidInputObject(false_data_2)).toBe(false);
        expect(v.isValidInputObject(false_data_3)).toBe(false);
    });

    it('should able to validate link object', function() {
        var data_1 = { id : "Hello", x : 0, y : 1};
        var data_2 = 'Satu';
        var false_data_1 = {};

        expect(v.isValidLinkObject(data_1)).toBe(true);
        expect(v.isValidLinkObject(data_2)).toBe(true);
        expect(v.isValidLinkObject(false_data_1)).toBe(false);
    });

    it('should able to validate the input', function() {
        var data = [
        { id : 'One',   x : 0, y : 0},
        { id : 'Two',   x : 1, y : 0},
        { id : 'Three', x : 2, y : 0},
        { id : 'Four',  x : 3, y : 0},
        ];

        var false_data = [
        { id : 'One',   x : 0, y : 0},
        { id : 'Two',   x : 1, y : 0},
        { id : 'Three', x : 2, y : 0},
        {},
        ];

        expect(v.isValidInput(data)).toBe(true);
        expect(v.isValidInput(false_data)).toBe(false);

    });

    it('should able to validate the link', function() {

        var data = [
        { id : 'One' },
        'Two',
        'Three',
        { id : 'Four' }
        ];

        var false_data = [
        { id : 'One' },
        'Two',
        'Three',
        {}
        ];


        expect(v.isValidLink(data)).toBe(true);
        expect(v.isValidLink(false_data)).toBe(false);
    });

});
