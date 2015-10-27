function flowProcessor(inputString, mindWebConfig) {

    var numbersPerLine =  
        (mindWebConfig.container.width / mindWebConfig.rect.width) -1;

    var basic_nodes = inputString.split("\n").filter(function(s,i) { return s !== '';});

    // remove nodes with dot comma ;
    var toTextProcessor = [];
    basic_nodes = basic_nodes.filter(function(s,i) {
        if (s.indexOf(';') == -1) {
            return true;
        } else {
            toTextProcessor.push(s);
            return false;
        }
    });

    var previous = null;
    basic_nodes = basic_nodes.map(function(s, pos) {

        var ret = {
            id : s,
            name : s,
            x : pos % numbersPerLine,
            y : Math.floor(pos / numbersPerLine) * 20,
            color : 'steelblue'
        };

        if (previous !== null) {
            ret.link = [previous];
        }

        previous = s;

        return ret;
    });

    var fromTextProcessor = textProcessor(toTextProcessor.join('\n'));

    return basic_nodes.concat(fromTextProcessor);
}
