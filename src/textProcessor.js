

function textProcessor(inputString) {

    var color_names = ['aliceblue','antiquewhite','aqua','aquamarine','azure','beige','bisque','black','blanchedalmond','blue','blueviolet','brown','burlywood','cadetblue','chartreuse','chocolate','coral','cornflowerblue','cornsilk','crimson','cyan','darkblue','darkcyan','darkgoldenrod','darkgray','darkgreen','darkgrey','darkkhaki','darkmagenta','darkolivegreen','darkorange','darkorchid','darkred','darksalmon','darkseagreen','darkslateblue','darkslategray','darkslategrey','darkturquoise','darkviolet','deeppink','deepskyblue','dimgray','dimgrey','dodgerblue','firebrick','floralwhite','forestgreen','fuchsia','gainsboro','ghostwhite','gold','goldenrod','gray','green','greenyellow','grey','honeydew','hotpink','indianred','indigo','ivory','khaki','lavender','lavenderblush','lawngreen','lemonchiffon','lightblue','lightcoral','lightcyan','lightgoldenrodyellow','lightgray','lightgreen','lightgrey','lightpink','lightsalmon','lightseagreen','lightskyblue','lightslategray','lightslategrey','lightsteelblue','lightyellow','lime','limegreen','linen','magenta','maroon','mediumaquamarine','mediumblue','mediumorchid','mediumpurple','mediumseagreen','mediumslateblue','mediumspringgreen','mediumturquoise','mediumvioletred','midnightblue','mintcream','mistyrose','moccasin','navajowhite','navy','oldlace','olive','olivedrab','orange','orangered','orchid','palegoldenrod','palegreen','paleturquoise','palevioletred','papayawhip','peachpuff','peru','pink','plum','powderblue','purple','red','rosybrown','royalblue','saddlebrown','salmon','sandybrown','seagreen','seashell','sienna','silver','skyblue','slateblue','slategray','slategrey','snow','springgreen','steelblue','tan','teal','thistle','tomato','turquoise','violet','wheat','white','whitesmoke','yellow','yellowgreen'];

    var name = '';
    var x;
    var y;
    var color = 'steelblue';
    var link = [];

    var configurator = {
        nextPosition : {0:'below'},
        nextPositionIndex : [0],

        flow : [],
        flowstop : [],

        mm : [],
        mmstop : []
    };

    function getNamePositionLink(s, pos) {

        var name, x, y, link;
        var a = s.split(";");

        // name
        name = a.shift();
        // x
        if (!isNaN(a[0])) { 
            x = a.shift(); 
            // y
            if (!isNaN(a[0])) { 
                y = a.shift(); 
            }
        } else if (['hor', 'ver', 'right', 'left', 'top', 'down', 'above', 'below'].indexOf(a[0]) !== -1) {
            configurator.nextPosition[pos] = a.shift();
        } 
        if (x === undefined && pos === 0) { x = 0; y = 0; }
        link = a;
        return [name, x, y, link];
    }

    function getColor(s) {
        var t = s.split(";");
        for (var i in t) {
            if (color_names.indexOf(t[i]) !== -1) {
                return t[i];
            }
        }
        return 'steelblue';
    }

    function processSettings(s, pos) {
        var t = s.split(";");

        for (var i in t) {
            switch (t[i]) {
                case 'hor':
                    configurator.nextPosition[pos] = 'right';
                    break;
                case 'ver':
                    configurator.nextPosition[pos] = 'below';
                    break;

                case 'flow':
                    configurator.flow.push(pos);
                    break;
                case 'flowstop':
                    configurator.flowstop.push(pos);
                    break;

                case 'mm' :
                    configurator.mm.push(pos);
                    break;

                case 'mmstop' :
                    configurator.mmstop.push(pos);
                    break;
            }
        }
    }



    var basic_nodes = inputString.split("\n").filter(function(s,i) { return s !== '';});
    basic_nodes = basic_nodes.map(function(s, pos) {

        s = s.split('|');

        var node = {};

        /* set Name Position and Link */
        var namePositionLink = getNamePositionLink(s[0], pos);
        node.name = namePositionLink[0];
        node.x = namePositionLink[1];
        node.y = namePositionLink[2];
        if (node.link === undefined) {
            node.link = [];
        }
        node.link = node.link.concat(namePositionLink[3]);

        /* set Color and modify link by tempSetting */
        // default color
        node.color = s.length > 1 ? getColor(s[1]) : 'steelblue';

        if (s.length > 1) {
            processSettings(s[1], pos);
        }
        return node;
    });

    /** set automatic position **/
    var orientation = configurator.nextPosition[0];

    for (var i = 0; i < basic_nodes.length; i++) {

        if (configurator.nextPosition[i]) {
            orientation = configurator.nextPosition[i];
        }

        if (basic_nodes[i].x === undefined) {
            switch(orientation) {
                case 'below':
                    basic_nodes[i].x = basic_nodes[i - 1].x;
                    basic_nodes[i].y = parseInt(basic_nodes[i - 1].y) + 1;
                    break;
                case 'above':
                    basic_nodes[i].x = basic_nodes[i - 1].x;
                    basic_nodes[i].y = parseInt(basic_nodes[i - 1].y) - 1;
                    break;
                case 'right':
                    basic_nodes[i].x = parseInt(basic_nodes[i - 1].x) + 1;
                    basic_nodes[i].y = basic_nodes[i - 1].y;
                    break;
                case 'left':
                    basic_nodes[i].x = parseInt(basic_nodes[i - 1].x) - 1;
                    basic_nodes[i].y = basic_nodes[i - 1].y;
                    break;
            }
        }
    }
    

    configurator.flow.forEach(function(flowStart, pos) {
        var flowTo, flowFrom = flowStart + 1;

        if (configurator.flowstop.length > 0) {
            flowTo = configurator.flowstop.shift() + 1;
        } else {
            flowTo = basic_nodes.length;
        }

        var flowName = basic_nodes[flowStart].name;

        for (var j = flowFrom; j < flowTo; j++) {
            basic_nodes[j].link = basic_nodes[j].link.concat([flowName]);
            flowName = basic_nodes[j].name;
        }
    });


    function isMm(pos) { return configurator.mm.indexOf(parseInt(pos)) !== -1; }
    function isMmStop(pos) { return configurator.mmstop.indexOf(parseInt(pos)) !== -1; }
    function addLinkToPos(pos, link) { basic_nodes[pos].link = basic_nodes[pos].link.concat(link); }

    var depth = 0;
    var name_on_level = [];
    var capture = false;
    for (i in basic_nodes) {
        if (capture) {
            addLinkToPos(i, [name_on_level[depth]]);

            if (isMm(i)) {
                depth++;
                name_on_level[depth] = basic_nodes[i].name;
            }
        }

        if (isMm(i) && !capture) {
            capture = true;
            depth++;
            name_on_level[depth] = basic_nodes[i].name;
        }

        if (isMmStop(i)) {
            depth--;
            if (depth < 0) {console.error('Wrong with something?');}
        }
    }

    return basic_nodes;
}

if (module) {
    module.exports = textProcessor;
}
