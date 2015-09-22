describe("Painter Test", function() {

    it('should call lookup (PRIVATE)', function() {
        data = [
        { 
            id : "egon", 
            x : 0,
            y : 0,
            link : [ "marsha", "rafa", "nova" ]
        }, {
            id : "marsha",
            x : 1,
            y : 0,
            link : []
        } , {
            id : "rafa",
            x : 0,
            y : 1,
            link : []
        } , {
            id : "nova",
            x : 1,
            y : 1,
            link : ["rafa"]
        }];

        var mwp = new MindWebPainter("");

        mwp.__testonly__.createLookup(data);
        expect(mwp.__testonly__.lookup("egon")).toBe(data[0]);
        expect(mwp.__testonly__.lookup("marsha")).toBe(data[1]);
        expect(mwp.__testonly__.lookup("nova")).toBe(data[3]);
        expect(mwp.__testonly__.lookup("rafa")).toBe(data[2]);

    });

    it('should able to create connection (PRIVATE)', function() {

        data = [
        { 
            id : "egon", 
            x : 0,
            y : 0,
            color : 'steelblue',
            link : [ "marsha", "rafa", "nova" ]
        }, {
            id : "marsha",
            x : 1,
            y : 0,
            color : 'steelblue',
            link : []
        } , {
            id : "rafa",
            x : 0,
            y : 1,
            color : 'steelblue',
            link : []
        } , {
            id : "nova",
            x : 1,
            y : 1,
            color : 'steelblue',
            link : ["rafa"]
        }];

        var mwp = new MindWebPainter("");

        // depend on lookup function
        // so prepare it first
        mwp.__testonly__.createLookup(data);
        
        // create connection need this function first
        var connections = mwp.__testonly__.createConnections(data);

        // check one first
        expect(connections).toEqual([
            { from : data[0], to : data[1], text : '', color : 'steelblue', side : { from : 'right',  to : 'left'  }},
            { from : data[0], to : data[2], text : '', color : 'steelblue', side : { from : 'bottom', to : 'top'    }},
            { from : data[0], to : data[3], text : '', color : 'steelblue', side : { from : 'bottom', to : 'top'  }},
            { from : data[3], to : data[2], text : '', color : 'steelblue', side : { from : 'left',   to : 'right' }}
        ]);
    });

    describe('draw function', function() {

        var mwp;

        beforeEach(function() {

            mwp = new MindWebPainter("body", {
                container : { width : 400, height : 200 }
            });

            mwp.draw([ 
                    { id : "egon", x : 0, y : 0, color : 'steelblue', link : [ "marsha", "rafa", "nova" ] },
                    { id : "marsha", x : 1, y : 0, color : 'steelblue', link : [] },
                    { id : "rafa", x : 0, y : 1, color : 'steelblue', link : [] },
                    { id : "nova", x : 1, y : 1, color : 'steelblue', link : ["rafa"] }
            ]);
        });

        afterEach(function() {
            d3.select('false-svg').remove();
            d3.select('canvas').remove();
        });

        function getSvg() { return d3.select('false-svg'); }

        function getRect(index) { 
            if (index === undefined) {
                return getSvg().selectAll('rect')[0]; 
            }

            return d3.select(getSvg().selectAll('rect')[0][index]);
        }

        function getLine(index) {
            if (index === undefined) {
                return getSvg().selectAll('line')[0]; 
            }

            return d3.select(getSvg().selectAll('line')[0][index]);

        }

        it('should able draw 4 rect', function() {
            expect(getRect().length).toBe(4);
        });

        it('should set the scale', function() {
            var scale = mwp.getScale();

            expect(scale.x(0)).toBe(0);
            expect(scale.x(1)).toBe(300);
            expect(scale.y(0)).toBe(0);
            expect(scale.y(1)).toBe(200-40);
        });

        it('should set the position(x,y) of the rect right', function() {
            expect(getRect(0).attr('x')).toBe('0');
            expect(getRect(0).attr('y')).toBe('0');

            expect(getRect(1).attr('x')).toBe('300');
            expect(getRect(1).attr('y')).toBe('0');

            expect(getRect(2).attr('x')).toBe('0');
            expect(getRect(2).attr('y')).toBe('160');

            expect(getRect(3).attr('x')).toBe('300');
            expect(getRect(3).attr('y')).toBe('160');
        });

        it('should draw the connectors', function() {
            expect(getLine().length).toBe(4);
        });

        it('should draw the posiiton(x,y) of the lines right', function() {
            expect(getLine(0).attr('x1')).toBe('100');
            expect(getLine(0).attr('y1')).toBe('20');
            expect(getLine(0).attr('x2')).toBe('300');
            expect(getLine(0).attr('y2')).toBe('20');
            expect(getLine(0).attr('x3')).toBe('100');
            expect(getLine(0).attr('y3')).toBe('20');
            expect(getLine(0).attr('x4')).toBe('300');
            expect(getLine(0).attr('y4')).toBe('20');

            expect(getLine(2).attr('x1')).toBe('100');
            expect(getLine(2).attr('y1')).toBe('20');
            expect(getLine(2).attr('x2')).toBe('300');
            expect(getLine(2).attr('y2')).toBe('20');
            expect(getLine(2).attr('x3')).toBe('100');
            expect(getLine(2).attr('y3')).toBe('20');
            expect(getLine(2).attr('x4')).toBe('350');
            expect(getLine(2).attr('y4')).toBe('160');

            /*
            expect(getLine(1).attr('x')).toBe('300');
            expect(getLine(1).attr('y')).toBe('0');

            expect(getLine(2).attr('x')).toBe('0');
            expect(getLine(2).attr('y')).toBe('160');

            expect(getLine(3).attr('x')).toBe('300');
            expect(getLine(3).attr('y')).toBe('160');
            */
        });


    });

});
