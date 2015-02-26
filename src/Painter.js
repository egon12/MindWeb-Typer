
function Painter(divid) {

    var chart = null;
    var ctx = null;
    var nodeContainer = null;
    var base = null;

    var options = {
        width : 600,
        height : 400,
        boxSize : {width : 120, height : 80},
        font : {size : 16, family : "Cantarell"}
    };

    this.init = function(divid) {

        base = d3.select(divid);

        base.selectAll('canvas').remove();
        base.selectAll('nodecontainer').remove();

        chart = base.append('canvas')
            .attr('width', options.width)
            .attr('height', options.height);

        ctx = chart.node().getContext('2d');

        nodeContainer = base.append('nodecontainer');

        d3.timer(drawCanvas);
    }

    function getNodeX(d, i) {
        return parseInt(d.x);
    }

    function getNodeY(d, i) {
        return parseInt(d.y);
    }

    function getScale(nodes) {

        var minX = d3.min(nodes, getNodeX);
        var maxX = d3.max(nodes, getNodeX);
        var minY = d3.min(nodes, getNodeY);
        var maxY = d3.max(nodes, getNodeY);

        if (minX == maxX) {
            minX -= 1;
            maxX += 1;
        }

        if (minY == maxY) {
            minY -= 1;
            maxY += 1;
        }

        return {
            x : d3.scale.linear()
                .range([0, options.width - options.boxSize.width])
                .domain([minX, maxX]),
            y : d3.scale.linear()
                .range([0, options.height - options.boxSize.height])
                .domain([minY, maxY]),
        };
    }

    function getPointsAddition(datum1, datum2) {
        var hor = datum1.x - datum2.x;
        var ver = datum1.y - datum2.y;
        var addY1 = 0;
        var addY2 = 0;
        var addX1 = 0;
        var addX2 = 0;
        var orientation;

        if (Math.abs(hor) > Math.abs(ver)) {
            // in side left or right
            addY1 = addY2 = options.boxSize.height/2;
            if (hor < 0) {
                addX1 = options.boxSize.width;
                orientation = "right";
            } else {
                addX2 = options.boxSize.width;
                orientation = "left";
            }
        } else {
            // in top or bottom side
            addX1 = addX2 = options.boxSize.width/2;
            if (ver < 0) {
                addY1 = options.boxSize.height;
                orientation = "bottom";
            } else {
                addY2 = options.boxSize.height;
                orientation = "top";
            }
        }

        return {
            orientation : orientation,
            start : {
                x : addX1,
                y : addY1
            },
            end : {
                x : addX2,
                y : addY2 
            }
        };

    }

    this.draw = function(data) {

        var nodes = nodeContainer.selectAll('node')
            .data(data, function(datum) {return datum.name;});

        var scale = getScale(data);

        nodes.transition()
            .duration(600)
            .attr('x', function(d, i) {return scale.x(d.x);})
            .attr('y', function(d, i) {return scale.y(d.y);})
            .attr('backgroundColor', function(d, i) {return d.color;});

        nodes.enter()
            .append('node')
            .attr('backgroundColor', 'white')
            .attr('color', 'white')
            .attr('x', function(d, i) {return scale.x(d.x);})
            .attr('y', function(d, i) {return scale.y(d.y);})
            .transition()
            .duration(600)
            .attr('backgroundColor', function(d, i) {return d.color;});

        nodes.exit()
            .transition()
            .duration(600)
            .attr('backgroundColor', 'white')
            .remove();
    };


    function drawCanvas() {

        var nodes = nodeContainer.selectAll('node');

        ctx.clearRect(0,0,options.width, options.height);
        ctx.font = options.font.size + "px " + options.font.family;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        nodes.each(function(datum, i) {

            var el = d3.select(this);

            var x = parseInt(el.attr('x'));
            var y = parseInt(el.attr('y'));
            var colorBox = el.attr('backgroundColor');
            var color = el.attr('color');

            var boxWidth = options.boxSize.width;
            var boxHeight = options.boxSize.height;

            // draw box and text
            ctx.fillStyle = colorBox;
            ctx.fillRect(x, y, boxWidth, boxHeight );

            ctx.fillStyle = color;
            ctx.fillText(datum.name, x+boxWidth/2, y+boxHeight/2);

            // draw line
            ctx.strokeStyle = colorBox;
            ctx.lineWidth = '4';

            nodes.filter(function(d, i) {return datum.link.indexOf(d.name) !== -1;})
                .each (function(d, i) {
                    if (d.name == datum.name) { return; }

                    var nodeTarget = d3.select(this);

                    var pointAddition = getPointsAddition(datum, d);
                    var pointStart = {
                        x : x + pointAddition.start.x,
                        y : y + pointAddition.start.y 
                    };

                    var pointEnd = {
                        x : parseInt(nodeTarget.attr('x')) + pointAddition.end.x,
                        y : parseInt(nodeTarget.attr('y')) + pointAddition.end.y,
                    };

                    ctx.beginPath();
                    ctx.moveTo(pointStart.x, pointStart.y);
                    switch (pointAddition.orientation) {
                        case "ver":
                        case "top":
                        case "bottom":
                            ctx.bezierCurveTo(pointStart.x, pointEnd.y, pointEnd.x, pointStart.y, pointEnd.x, pointEnd.y);
                            break;
                        case "hor" :
                        case "left" :
                        case "right" :
                            ctx.bezierCurveTo(pointEnd.x, pointStart.y, pointStart.x, pointEnd.y, pointEnd.x, pointEnd.y);
                            break;
                    }
                    ctx.stroke();
                });
        });
    }


    this.getOptions = function() {
        return JSON.stringify(options, undefined, 2);
    };

    this.setOptions = function(options_str) {
        options = JSON.parse(options_str);
    };

    this.init(divid);
}
