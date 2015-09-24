/**
 * Class MinWebPainter 
 */
var MindWebPainter = function(container_id, config_parameter) {

    // check 
    var check_dependencies = function() {
        if (d3 === undefined) { throw "depend on d3js"; }
        if ($ === undefined) { throw "depend on jQuery"; }
    }();

    var validator = new Validator();

    /** Default config */
    if (container_id === '') {
        container_id = 'body';
    }

    var config = {
        container : {
            id     : container_id,
            width  : 600,
            height : 400
        },
        rect : { 
            width : 100,
            height : 40,
        },
        font : {
            family : "Cantarell",
            size : 16
        }
    };

    /**
     * setConfig
     * @param {object} config - config
     */
    this.setConfig = function(conf) {
        config = $.extend(true, config, conf);
    };

    /**
     * getConfig
     */
    this.getConfig = function() { return config; };

    // ok prepare
    var base, chart, ctx, svg, scale;
    
    /** init function set or constructor */
    this.init = function(conf) {

        this.setConfig(conf);

        // short on container config
        var cc = config.container;

        base = d3.select(cc.id);

        base.selectAll('canvas').remove();
        base.selectAll('false-svg').remove();

        chart = base.append('canvas')
            .attr('width', cc.width)
            .attr('height', cc.height);

        ctx = chart.node().getContext('2d');
        svg = base.append('false-svg');

        d3.timer(this.drawCanvas);
    };



    /**
     * main user functions
     * @param {array} data - array of object with x in minimal_scale 
     */
    this.draw = function(data) {
        createLookup(data);
        scale = this.getScale(data);
        drawNode(data);
        drawNodeConnection(data);
    };

    
    /** lookup variable */
    var _lookup = {};

    /** create look up */
    function createLookup(data) {
        _lookup = {};
        for (var i = 0; i < data.length; i++) {
            _lookup[data[i].id] = data[i];
        }
    }

    /** lookup function */
    function lookup(id) { return _lookup[id]; }

    /**
     * called in draw function
     *
     * D3 function is called in here 
     *
     * @param {array} data - same in draw
     */
    function drawNode(data) {

        var rects = svg.selectAll('rect')
            .data(data, function(datum) {return datum.id;});

        rects.transition()
            .duration(600)
            .attr('x', function(d, i) { return scale.x(d.x); })
            .attr('y', function(d, i) { return scale.y(d.y); })
            .attr('fill', function(d, i) { return d.color; });

        // todo maybe try to delete attr, attr y and attr others?
        rects.enter()
            .append('rect')
            .attr('fill', 'white')
            .attr('color', 'white')
            .attr('x', function(d, i) {return scale.x(d.x);})
            .attr('y', function(d, i) {return scale.y(d.y);})
            .transition()
            .duration(600)
            .attr('fill', function(d, i) {return d.color;});

        rects.exit()
            .transition()
            .duration(600)
            .attr('fill', 'white')
            .remove();
    }

    /**
     * called in draw function
     *
     * create lines from connected links 
     *
     * @param {array} data - same in draw
     */
    function drawNodeConnection(data) {

        var lines = svg
            .selectAll('line')
            .data(createConnections(data));

        lines.transition()
            .duration(600)
            .attr('x1', get_connection_position_function_base('from', 'x'))
            .attr('y1', get_connection_position_function_base('from', 'y'))
            .attr('x4', get_connection_position_function_base('to', 'x'))
            .attr('y4', get_connection_position_function_base('to', 'y'))
            .attr('x2', get_connection_position_function_bezier('from', 'x'))
            .attr('y2', get_connection_position_function_bezier('from', 'y'))
            .attr('x3', get_connection_position_function_bezier('to', 'x'))
            .attr('y3', get_connection_position_function_bezier('to', 'y'))
            .attr('stroke', function(d, i) { return d.stroke; });

        lines.enter()
            .append('line')
            .attr('x1', get_connection_position_function_base('from', 'x'))
            .attr('y1', get_connection_position_function_base('from', 'y'))
            .attr('x4', get_connection_position_function_base('to', 'x'))
            .attr('y4', get_connection_position_function_base('to', 'y'))
            .attr('x2', get_connection_position_function_bezier('from', 'x'))
            .attr('y2', get_connection_position_function_bezier('from', 'y'))
            .attr('x3', get_connection_position_function_bezier('to', 'x'))
            .attr('y3', get_connection_position_function_bezier('to', 'y'))
            .attr('stroke', 'white')
            .transition()
            .duration(600)
            .attr('stroke', function(d, i) { return d.stroke; });

        lines.exit()
            .transition()
            .duration(600)
            .attr('stroke', 'white')
            .remove();

    }

    /**
     * Ok, if this it must execute after the rect is build
     * deprecated, but the code is a litle bit beautifulll
     */
    function drawNodeConnection_2(data) {

        var rects = svg.selectAll('rect');

        rects.each(function(d, i) {

            rects
                .filter(function(d_link, i) { 
                    var link_ids = d.link.map(function (d, i) {
                       if(typeof d === 'string' || d instanceof String) {
                           return d;
                       } else if (typeof d === 'Object' && d.id !== undefined) {
                           return d.id;
                       }
                    })
                    return d_link.id in ids; 
                })
                .each(function(d_link, i) {

                    //var conn = createConnection(d, d_link);
                    rects.append('path');
                });
        });
    }


    function createConnections(data) {

        var connection = [];

        // lets make assumption the link is there
        // {id:"node1", color:"steelblue", text:"decendent of", from_side:"left" to_side:"up"}

        for (var i in data) {
            var from = data[i];
            for (var j in from.link) {

                var color, text, to, link = from.link[j];

                if (typeof link === 'string' || link instanceof String) {
                    to = lookup(link);
                } else {
                    to = lookup(link.id);
                }

                if (link.color === undefined || link.color === '') {
                    color = from.color;
                } else { color = link.color; }

                if (link.text === undefined) { text = ''; }
                else { text = link.text; }

                connection.push({
                    from   : from,
                    to     : to,
                    text   : text,
                    stroke : color,
                    side   : calculateSide(link, from, to),
                });
            }
        }

        return connection;
    }

    function calculateSide(link, from, to) {

        var side = {};

        if (link.from_side === undefined && link.to_side === undefined) {
            var hor = to.x - from.x;
            var ver = to.y - from.y;

            if (Math.abs(hor) > Math.abs(ver)) {
                if (hor > 0) { side.from = 'right'; side.to = 'left'; }
                else { side.from = 'left'; side.to = 'right'; }
            } else {
                if (ver > 0) { side.from = 'bottom'; side.to = 'top'; }
                else { side.from = 'top'; side.to = 'bottom'; }
            }

            return side;
        } else if (link.from_side !== undefined && link.to_side !== undefined) {
            side.from = link.from_side;
            side.to   = link.to_side;
        }

        return side;
    }

    /**
     *
     */
    var that = this;
    function get_connection_position_function_base(fromto, xy) {

        return function (d, i) {
            var side = d.side[fromto];
            var config = that.getConfig().rect;

            // initialized if not exist
            if (d.conn === undefined) { d.conn = {}; }
            if (d.conn[fromto] === undefined) { d.conn[fromto] = {}; }

            // count
            modifier = 0;
            if (xy == 'x') {
                if (side == 'top' || side == 'bottom') { modifier = config.width / 2; } 
                else if ( side == 'right' ) { modifier = config.width; }
            } else if (xy == 'y') {
                if (side == 'left' || side == 'right') { modifier = config.height / 2; } 
                else if ( side == 'bottom' ) { modifier = config.height; }
            }
            d.conn[fromto][xy] = scale[xy](d[fromto][xy]) + modifier;
            return d.conn[fromto][xy];
        };
    }

    function get_connection_position_function_bezier(fromto, xy) {

        return function (d, i) {

            var fromto_a;
            if (fromto == 'from') { fromto_a = 'to'; }
            else if (fromto == 'to') {fromto_a = 'from';}
            
            var side = d.side[fromto];
            var b = fromto;

            if (side == 'top' || side == 'bottom') {
                if (xy == 'y') { b = fromto_a; }
            } else if (side == 'right' || side == 'left') {
                if (xy == 'x') { b = fromto_a; }
            }

            return d.conn[b][xy];
        };

    }

    /** getScale **/
    this.getScale = function(data) {

        if (data === undefined) {
            if (scale !== null) {
                return scale;
            }
        }

        var xMinMax = d3.extent(data, function(d) { return parseFloat(d.x); } );
        var yMinMax = d3.extent(data, function(d) { return parseFloat(d.y); } );

        // add +1 and -1 to minMax if min == max
        function repairSingle(dMinMax) { 
            if (dMinMax[0] == dMinMax[1]) { 
                return [(dMinMax[0] - 1), dMinMax[1] +1];
            }
        }

        repairSingle(xMinMax);
        repairSingle(yMinMax);

        return {
            x : d3.scale.linear()
                .range([0, config.container.width - config.rect.width])
                .domain(xMinMax),
            y : d3.scale.linear()
                .range([0, config.container.height - config.rect.height])
                .domain(yMinMax),
        };
    };

    this.drawCanvas = function() {

        var rects = svg.selectAll('rect');

        ctx.clearRect(0,0,config.container.width,config.container.height);
        ctx.font = config.font.size + "px " + config.font.family;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        rects.each(function(d, i) {

            var el = d3.select(this);

            var x = Number(el.attr('x'));
            var y = Number(el.attr('y'));

            ctx.fillStyle = el.attr('fill');
            ctx.fillRect(x, y, config.rect.width, config.rect.height);

            ctx.fillStyle = el.attr('color');
            ctx.fillText(d.id.trim(), x + config.rect.width/2, y + config.rect.height/2);

            //this.drawLink(d, rects);
        });

        var lines = svg.selectAll('line');

        ctx.lineWidth = '4';
        lines.each(function(d, i) {

            var el = d3.select(this);

            var x1 = el.attr('x1');
            var y1 = el.attr('y1');
            var x2 = el.attr('x2');
            var y2 = el.attr('y2');
            var x3 = el.attr('x3');
            var y3 = el.attr('y3');
            var x4 = el.attr('x4');
            var y4 = el.attr('y4');

            ctx.strokeStyle = d.stroke;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.bezierCurveTo(x2, y2, x3, y3, x4, y4);
            ctx.stroke();
        });

    };


    this.init(config_parameter);

    /** __testonly__ */
    this.__testonly__ = {
        createLookup : createLookup,
        lookup : lookup,
        createConnections : createConnections,
        getScale : this.getScale,
        ctx : ctx,
        getLinesData : function() { return svg.selectAll('line').data(); },
        getRectsData : function() { return svg.selectAll('rect').data(); },


    };
};
