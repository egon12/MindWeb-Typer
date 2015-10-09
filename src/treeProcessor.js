
/**

1 Cari anak di setiap level

2 Kaliin anak terbanyak di setiap level (maximum width)
3 level 1 maximum_width + 1 /2 
4 node_top = maximum_width + 1 /2 

Looping
5 level_n_width =  maximum_width / anak terbanyak di level n - 1 (dikaliin)
6 node_ke_x = (level_n_width * (x - 1))  + (level_n_width + 1 /2)

  */
function treeProcessor(jsonSource) {

    var childNodesName = 'options';
    var nodesName = 'name';
    
    this.rootNode = null;

    this.result = [];

    this.setRootNode = function(jsonSource) {
        this.rootNode = jsonSource;
    };

    this.maximumWidth = 0;
    this.largestChildrenLength = {};
    this.levelWidth = {};

    this.setAllWidth = function() {

        this.largestChildrenLength = {};


        var optionsLength = 0;
        for (var option in this.rootNode) {
            optionsLength += 1;
        }
        this.largestChildrenLength.level_1 = optionsLength;


        this.getChildrenRecursive(this.rootNode, function(node, level) {
            var levelName = 'level_' + (level + 1);
            if (this.largestChildrenLength[levelName] === undefined) {
                this.largestChildrenLength[levelName] = 0;
            }
            var optionsLength = 0;
            for (var option in node[childNodesName]) {
                optionsLength += 1;
            }
            if (this.largestChildrenLength[levelName] < optionsLength) {
                this.largestChildrenLength[levelName] = optionsLength;
            }
        });

        this.maximumWidth = 1;
        for (var i in this.largestChildrenLength) {
            this.maximumWidth *= this.largestChildrenLength[i];
            this.levelWidth[i] = this.maximumWidth;
        }

        // dirty hack hahah
        this.maximumWidth = 1;
        for (i in this.largestChildrenLength) {
            if (this.largestChildrenLength[i] !== 0) {
                this.maximumWidth *= this.largestChildrenLength[i];
            }
        }

        for (i in this.levelWidth) {
            this.levelWidth[i] = this.maximumWidth / this.levelWidth[i];
        }

        this.rootNode._startX = 0;

        this.getChildrenRecursive(this.rootNode, function(node, level, index, option_name, nodeParent) {
            node._startX = nodeParent._startX + this.levelWidth['level_' + level] * index;
        });
    };

    var result_index = 0;
    this.createNodes = function() {

        // prepare first
        var nodes = [];

        nodes.push({
            id : this.rootNode[nodesName],
            name : this.rootNode[nodesName],
            link : [],
            y    : 0,
            x    : (this.maximumWidth + 1)/2,
            color : 'steelblue'
        });

        function createChildrenNode(node, level, index, option_name, nodeParent) {

            var levelName = 'level_' + level;
            var levelWidth = this.levelWidth[levelName];
            var id, name, color;

            color = 'steelblue';
            if (node.type == 'result') {
                id = 'result' + result_index++;
                name = node.value;
            } else {
                id = node[nodesName];
                name = node[nodesName];
            }

            nodes.push({
                id : id,
                name : name,
                color : color,
                link : [ { id:nodeParent[nodesName], text:option_name} ],
                y    : level * 10,
                x    : nodeParent._startX + levelWidth*index + (levelWidth+1)/2
            });
        }

        this.getChildrenRecursive(this.rootNode, createChildrenNode);
        return nodes;
    };


    // Ok, the node it self it is included?
    // just excluded, it easier to include later
    this.getChildrenRecursive = function(node, callback, level) {

        if (node[childNodesName] === undefined) {
            return;
        }

        if (level === undefined) {
            level = 1;
        }

        var index = 0;
        for (var option in node[childNodesName]) {
            callback(node[childNodesName][option], level, index, option, node);
            index += 1;
            this.getChildrenRecursive(node[childNodesName][option], callback, level + 1);
        }
    };



    // the main
    this.setRootNode(jsonSource);
    this.setAllWidth();
    return this.createNodes();
}
