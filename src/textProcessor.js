

function textProcessor(inputString) {

    var color_names = ['aliceblue','antiquewhite','aqua','aquamarine','azure','beige','bisque','black','blanchedalmond','blue','blueviolet','brown','burlywood','cadetblue','chartreuse','chocolate','coral','cornflowerblue','cornsilk','crimson','cyan','darkblue','darkcyan','darkgoldenrod','darkgray','darkgreen','darkgrey','darkkhaki','darkmagenta','darkolivegreen','darkorange','darkorchid','darkred','darksalmon','darkseagreen','darkslateblue','darkslategray','darkslategrey','darkturquoise','darkviolet','deeppink','deepskyblue','dimgray','dimgrey','dodgerblue','firebrick','floralwhite','forestgreen','fuchsia','gainsboro','ghostwhite','gold','goldenrod','gray','green','greenyellow','grey','honeydew','hotpink','indianred','indigo','ivory','khaki','lavender','lavenderblush','lawngreen','lemonchiffon','lightblue','lightcoral','lightcyan','lightgoldenrodyellow','lightgray','lightgreen','lightgrey','lightpink','lightsalmon','lightseagreen','lightskyblue','lightslategray','lightslategrey','lightsteelblue','lightyellow','lime','limegreen','linen','magenta','maroon','mediumaquamarine','mediumblue','mediumorchid','mediumpurple','mediumseagreen','mediumslateblue','mediumspringgreen','mediumturquoise','mediumvioletred','midnightblue','mintcream','mistyrose','moccasin','navajowhite','navy','oldlace','olive','olivedrab','orange','orangered','orchid','palegoldenrod','palegreen','paleturquoise','palevioletred','papayawhip','peachpuff','peru','pink','plum','powderblue','purple','red','rosybrown','royalblue','saddlebrown','salmon','sandybrown','seagreen','seashell','sienna','silver','skyblue','slateblue','slategray','slategrey','snow','springgreen','steelblue','tan','teal','thistle','tomato','turquoise','violet','wheat','white','whitesmoke','yellow','yellowgreen'];

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

        flow:false,

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

        /**
          a = Name Position and Link 
          t = Color Size and Link Modifier
          */
        s = s.split('|');
        var node = {};

        var t = null;

        if (s.length > 1) {

            t = s[1].split(";");

        }


        /* set Name Position and Link */
        var a = s[0].split(";");

        node.name = a.shift();
        node.color = "steelblue";

        //set node.x
        if (typeof a[0] === 'number') {
            node.x = a.shift();
        }

        // set node.y
        if (typeof a[0] === 'number') {
            node.y = a.shift();
        }

        // set link
        if (node.link === undefined) {
            node.link = [];
        }
        node.link.concat(a);

        if (node.x !== undefined) {
            tempSettingVertical(node.x, pos - parseInt(node.y));
        }


        if (node.x === undefined) {
            setPositionByTempSettings(pos);
            node.x = x;
            node.y = y;
        } else if (node.y === undefined) {
            node.y = 0;
        }


        return node;


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

        var node =  {
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

        return node;
    });

}

if (module) {
    module.exports = textProcessor;
}
