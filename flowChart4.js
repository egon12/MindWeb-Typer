
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

var color_names = ['aliceblue','antiquewhite','aqua','aquamarine','azure','beige','bisque','black','blanchedalmond','blue','blueviolet','brown','burlywood','cadetblue','chartreuse','chocolate','coral','cornflowerblue','cornsilk','crimson','cyan','darkblue','darkcyan','darkgoldenrod','darkgray','darkgreen','darkgrey','darkkhaki','darkmagenta','darkolivegreen','darkorange','darkorchid','darkred','darksalmon','darkseagreen','darkslateblue','darkslategray','darkslategrey','darkturquoise','darkviolet','deeppink','deepskyblue','dimgray','dimgrey','dodgerblue','firebrick','floralwhite','forestgreen','fuchsia','gainsboro','ghostwhite','gold','goldenrod','gray','green','greenyellow','grey','honeydew','hotpink','indianred','indigo','ivory','khaki','lavender','lavenderblush','lawngreen','lemonchiffon','lightblue','lightcoral','lightcyan','lightgoldenrodyellow','lightgray','lightgreen','lightgrey','lightpink','lightsalmon','lightseagreen','lightskyblue','lightslategray','lightslategrey','lightsteelblue','lightyellow','lime','limegreen','linen','magenta','maroon','mediumaquamarine','mediumblue','mediumorchid','mediumpurple','mediumseagreen','mediumslateblue','mediumspringgreen','mediumturquoise','mediumvioletred','midnightblue','mintcream','mistyrose','moccasin','navajowhite','navy','oldlace','olive','olivedrab','orange','orangered','orchid','palegoldenrod','palegreen','paleturquoise','palevioletred','papayawhip','peachpuff','peru','pink','plum','powderblue','purple','red','rosybrown','royalblue','saddlebrown','salmon','sandybrown','seagreen','seashell','sienna','silver','skyblue','slateblue','slategray','slategrey','snow','springgreen','steelblue','tan','teal','thistle','tomato','turquoise','violet','wheat','white','whitesmoke','yellow','yellowgreen'];

function init() {
    
    base = d3.select('#vis');

    base.selectAll('canvas').remove();
    base.selectAll('nodecontainer').remove();

    chart = base.append('canvas')
        .attr('width', options.width)
        .attr('height', options.height);

    ctx = chart.node().getContext('2d');

    nodeContainer = base.append('nodecontainer');
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

function draw(data) {

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
}


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

function simpleProcessString(inputString) {

    var name = '';
    var x;
    var y;
    var color = 'steelblue';
    var link = [];

    var tempSettings = {
        orientation : "down",
        staticPosition : 0,
        offsetPosition : 0,

        link : [],

        mm : '',
        nomm : '', 

    };

    function tempSettingVertical(staticX, startYPosition) {
        tempSettings.orientation = 'down';
        tempSettings.staticPosition = staticX;
        tempSettings.offsetPosition = startYPosition;
    }

    function tempSettingHorizontal(staticY, startXPosition) {
        tempSettings.orientation = "right";
        tempSettings.staticPosition = staticY;
        tempSettings.offsetPosition = startXPosition;
    }

    function setPositionByTempSettings(pos) {
        if (tempSettings.orientation == 'down') {
            x = tempSettings.staticPosition;
            y = pos - tempSettings.offsetPosition;
        } else if (tempSettings.orientation == 'right') {
            x = pos - tempSettings.offsetPosition;
            y = tempSettings.staticPosition;
        }
    }

    function modifyLinkByTempSettings() {
        link = link.concat(tempSettings.link);
    }

    function modifyLinkByTempSettingsMm()
    {
        if (tempSettings.mm !== "" && link.indexOf(tempSettings.mm) == -1) {
            link.push(tempSettings.mm);
        } 

        var tsIndex = null;
        if (tempSettings.nomm !== "" && (tsIndex = link.indexOf(tempSettings.nomm)) !== -1) {
            link.splice(tsIndex, 1);
            tempSettings.nomm =  [];
        }
    }

    function processName(nameFromArray) {
        var a = nameFromArray.split(':');
        name = a.shift();

        a.forEach(function(setting, i) {

            if (color_names.indexOf(setting) !== -1) {
                color = setting;
                return;
            }

            switch (setting) {
                case 'mm':
                    tempSettings.nomm = tempSettings.mm;
                    tempSettings.mm = name;
                    break;
                case 'nomm':
                    tempSettings.mm = "";
                    tempSettings.nomm = name;
                    break;
                case 'link':
                    tempSettings.link = [name];
                    break;
                case 'nolink':
                    tempSettings.link = [];
                    break;
            } 
        });
        
    }


    return inputString.split("\n")
        .filter(function(s,i) {
            return s !== '';
        })
    .map(function(s, pos) {
        var a = s.split(",");

        processName(a[0]);
        link = [];

        switch(true) {

            case (a.length == 1):
                setPositionByTempSettings(pos);
                break;

            case (a.length >= 3 && a[1] == '_'):
                tempSettingHorizontal(a[2], pos);
                a.shift();
                a.shift();
                a.shift();
                link = link.concat(a);
                setPositionByTempSettings(pos);
                break;

            case (a.length >= 3 && a[1].match(/-?[0-9]*_/) !== null):
                var startXPosition = pos - parseInt(a[1].replace("_",""));
                tempSettingHorizontal(a[2], startXPosition);
                a.shift();
                a.shift();
                a.shift();
                link = link.concat(a);
                setPositionByTempSettings(pos);
                break;


            case (a.length == 2 && !isNaN(a[1])):
                //length 2 and a number?
                tempSettingVertical(a[1], pos);
                setPositionByTempSettings(pos);
                break;

            case (a.length >= 2 && isNaN(a[1])):
                a.shift();
                link = link.concat(a);
                setPositionByTempSettings(pos);

                break;

            case (a.length >= 3):
                a.shift();
                x = a.shift();
                y = a.shift();
                link = link.concat(a);
                break;

        }

        modifyLinkByTempSettings();

        var obj =  {
            name : name,
            x : x,
            y : y,
            color : color,
            link : link
        };

        /**
          todo why this is not work?

          */
        //modifyLinkByTempSettingsMm();

        return obj;
    });
}

function complexProcessString(inputString) {
    return inputString.split("\n").map(function(s) {
        var a = s.split(";");
        link = a.filter(function(d, pos) {return pos > 3;});
        return { id : a[0], name : a[1], x : a[2], y : a[3], link:link};
    });

}

function processInput() {
    draw(simpleProcessString(document.getElementById('input-form-content').value));
}

d3.timer(drawCanvas);
init();
processInput();

function saveLocal(id) {
    var obj = {
        content : document.getElementById('input-form-content').value,
        options : document.getElementById('input-form-options').value,
    };
    var allfc = localStorage.getItem('flowchart');
    //if not existed created
    if (allfc === null) {
        allfc = "[]";
    }
    allfc = JSON.parse(allfc);

    // 
    if (id === '') {
        allfc.push(obj);
    } else {
        allfc[id] = obj;
    }
    localStorage.setItem('flowchart', JSON.stringify(allfc));
}

function getLocal(id) {
    var allfc = localStorage.getItem('flowchart');
    if (allfc !== null) {
        allfc = JSON.parse(allfc);
        var fc = allfc[id];
        if (fc !== undefined) {
            document.getElementById('input-form-content').value = fc.content;
            document.getElementById('input-form-options').value = fc.options;
            options = JSON.parse(fc.options);
        } else {
            document.getElementById('input-form-content').value = "";
        }
    }
    init();
    processInput();
}



function getAllLocal() {
    var allfc = localStorage.getItem('flowchart');
    allfc.forEach(function(o) {

    });
}

document.getElementById('input-form').onsubmit = function(e) {
    var id = document.getElementById('input-form-local').value;
    saveLocal(id);
    getLocal(id);
    return false;
};


document.getElementById('input-form-local').onchange = function(e) {
    getLocal(e.currentTarget.value);
};

document.getElementById('input-form-content').onkeydown = function(e) {
    if (e.keyCode == 13) {
        processInput();
    }
};

document.getElementById('input-form-content').onchange = processInput;
document.getElementById('input-form-options').value = JSON.stringify(options, undefined, 2);
document.getElementById('input-form-options').onchange = function(e) {
    options = JSON.parse(e.currentTarget.value);
    init();
    processInput();
};

document.getElementById('file-button').onclick = function() {
    var currentdate = new Date(); 
    var datetime = "" +
        currentdate.getFullYear() +
        (currentdate.getMonth()+1)  +
        currentdate.getDate() + "-" +
        currentdate.getHours() +   
        currentdate.getMinutes();
    var downloadLink = document.createElement("a");
    downloadLink.href = 'data:text/json;charset=utf-8,' + escape(localStorage.getItem('flowchart'));
    downloadLink.download = 'flowchart-' + datetime + '.json';

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    localStorage.removeItem('flowchart');
};

document.getElementById('input-form-file').onchange = function(evt) {

    var f = evt.target.files[0]; 

    if (f) {
        var r = new FileReader();
        r.onload = function(e) { 
            var contents = e.target.result;
            localStorage.setItem('flowchart', contents);
        };
        r.readAsText(f);
    } else { 
        alert("Failed to load file");
    }
};
        
