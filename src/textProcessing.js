
function TextPreProcessor(inputString) {

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
