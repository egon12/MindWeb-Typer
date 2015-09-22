function barChart() {

    var that = {};

    var w, h;

    w = h = 500;

    that.render = function() {
        var svg = d3
            .select('body')
            .append('svg')
            .attr('height', w)
            .attr('width', w)
            .append('g')
            .attr('transform', 'translate(0,0)');


        x = d3.scale.ordinal().rangeRoundBands([0, w], 0.05);
        x.domain(data.map(function(d) {
          return d.date;
        }));

        y = d3.scale.linear().range([h, 0]);
        y.domain([0, d3.max(data, function(d) {
          return d.value;
        })]);

        // add bars

        var bars = svg.selectAll('.bar').data(this.getData());
        bars
            .enter().append('rect')
            .attr('class', 'bar')
            .attr("x", function(d) {
                return x(d.date);
            })
            .attr("width", x.rangeBand())
            .attr("y", function(d) {
                return y(d.value);
            })
            .attr("height", function(d) {
                return h - y(d.value);
            });
    };

    var data = null;

    that.setData = function(d) { data = d; };
    that.getData = function() { return data; };

    return that;
}
