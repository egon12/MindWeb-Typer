describe('Test D3.js with jasmine ', function() {

    var c;
    
    beforeEach(function() {
        var testData =  [{ date: '2014-01', value: 100}, { date: '2014-02', value: 140}, {date: '2014-03', value: 215}];
        c = barChart();
        c.setData(testData);
        c.render();
    });


    afterEach(function() {
        d3.selectAll('svg').remove();
    });

    describe('the svg ', function() {

        it('should be created', function() {
            expect(getSvg()).not.toBeNull();
        });

        it('should have the right width', function() {
            expect(getSvg().attr('width')).toBe('500');
        });

        it('should have the right width', function() {
            expect(getSvg().attr('height')).toBe('500');
        });
    });


    function getSvg() {
        return d3.select('svg');

    }

    describe('working with data ', function() {

        var c;
        beforeEach(function() {

            c = barChart();

        });

        it('should to be null when data is not specified', function() {
            expect(c.getData()).toBeNull();
        });

        it('should be able to update the data', function() {
            var testData =  [{ date: '2014-01', value: 100}, {date: '2014-02', value: 215}];
            c.setData(testData);
            expect(c.getData()).toBe(testData);
        });

    });

    describe('create bars ', function() {

        it('should render the corect number of bars', function() {
            expect(getBars().length).toBe(3);
        });

        /*
        it('should render bars with the correct height ', function() {
            expect(d3.select(getBars()[0]).attr('height')).toBeCloseTo(240);
        });

        it('should render with the correct x', function() {
            expect(d3.select(getBars()[0]).attr('x')).toBeCloseTo(9);
        });

        it('should render with the correct y', function() {
            expect(d3.select(getBars()[0]).attr('y')).toBeCloseTo(0);
        });
        */
    });

    function getBars() {
        return d3.selectAll('rect.bar')[0];
    }



});
