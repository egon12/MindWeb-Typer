function treeProcessor(jsonSource) {

    var childNodesName = 'options';

    var rootNode = null;

    this.getChildrenAtLevel = function(level) {

        var processingLevel = 1;
        var children = this.getChildren();

        if (level == 1) {
            return children;
        }
        while (level < processingLevel) {
            var array = [];
            for (var i in children) {
                array = array.concat(this.getChildren(children[i]));
            }
            children = array;
        }
        return children;
    };

    this.getChildren = function(theNode) {

        if (theNode === undefined) {
            return rootNode[childNodesName];
        }

        processingLevel += 1;
        return theNode[childNodesName];
    };


    this.getChildrenGroupByLevel = function() {
        var result = {};
        var level = 1;
    
        children = rootNode[childNodesName];
        result['level_' + level] = children;

        while (children.length !== 0) {
            level += 1;
            var children = [];
            for (var i in children) {
                children = children.concat(children[i][childNodesName]);
            }
            result['level_' + level] = children;
        }
        return result;
    };

    this.getWidthNeeded = function() {
        var allLevel = this.getChildrenGroupByLevel();
        var allNumbers = [];
        for (var level in allLevel) {
            allNumbers.push(allLevel[level].length);
        }
        return Math.max.apply(null, allNumbers);
    };
}
