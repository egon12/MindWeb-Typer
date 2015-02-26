assert = require('./assert.js');

textProcessor = require('../src/textProcessor.js');

/** test simple */
var expected = [{name : 'Hello', x : 0, y : 0, color : 'steelblue', link: [] }];
assert.nodesEquals(textProcessor('Hello'), expected);

expected.push({name : 'Hi', x : 0, y : 1, color : 'steelblue', link : [] });
assert.nodesEquals(textProcessor('Hello\nHi'), expected);

expected.push({name : 'TestColor', x : 0, y : 2, color : 'red', link : [] });
expected.push({name : 'TestColor2', x : 0, y : 3, color : 'red', link : [] });
assert.nodesEquals(textProcessor('Hello\nHi\nTestColor|red\nTestColor2|red'), expected);

expected.push({name : 'Link1', x : 0, y : 3, color : 'red', link : [] });
expected.push({name : 'Link2', x : 0, y : 3, color : 'red', link : ['Link1'] });
assert.nodesEquals(textProcessor('Hello\nHi\nTestColor|red\nTestColor2|red\nLink1\nLink2;Link1'), expected);

/** test position horizontal */
var expected = [
    {name : 'Pos1', x : 0, y : 0, color : 'steelblue', link: [] },
    {name : 'Pos2', x : 1, y : 0, color : 'steelblue', link: [] },
    {name : 'Pos3', x : 2, y : 0, color : 'steelblue', link: [] },
    {name : 'Pos4', x : 3, y : 0, color : 'steelblue', link: [] },
];
assert.nodesEquals(textProcessor('Pos1;0;0|hor\nPos2\nPos3\nPos4'), expected);

/** test coordinate position **/
var expected = [
    {name : 'Pos11', x : 1, y : 1, color : 'steelblue', link: [] },
    {name : 'Pos12', x : 1, y : 2, color : 'steelblue', link: [] },
    {name : 'Pos31', x : 3, y : 1, color : 'steelblue', link: [] },
    {name : 'Pos43', x : 4, y : 3, color : 'steelblue', link: [] },
];
assert.nodesEquals(textProcessor('Pos11;1;1\nPos12;1;2\nPos31;3;1\nPos43;4;3'), expected);

/** test right, left, above, below **/
var expected = [
    {name : 'Pos', x : 0, y : 0, color : 'steelblue', link: [] },
    {name : 'Pos right', x : 1, y : 0, color : 'steelblue', link: [] },
    {name : 'Pos empty', x : 2, y : 0, color : 'steelblue', link: [] },
    {name : 'Pos below', x : 2, y : 1, color : 'steelblue', link: [] },
];
assert.nodesEquals(textProcessor('Pos\nPos right;right\nPos empty\nPos below;below'), expected);


/** test flow */
var expected = [
    {name : 'Flow 1', x : 0, y : 0, color : 'steelblue', link: [] },
    {name : 'Flow 2', x : 0, y : 1, color : 'steelblue', link: ['Flow 1'] },
    {name : 'Flow 3', x : 0, y : 2, color : 'steelblue', link: ['Flow 2'] },
    {name : 'Flow 4', x : 0, y : 3, color : 'steelblue', link: ['Flow 3'] },
    {name : 'Flow 5', x : 0, y : 4, color : 'steelblue', link: [] },
    {name : 'Flow 6', x : 0, y : 5, color : 'steelblue', link: [] },
    {name : 'Flow 7', x : 0, y : 6, color : 'steelblue', link: ['Flow 6'] },
    {name : 'Flow 8', x : 0, y : 7, color : 'steelblue', link: ['Flow 7'] },
    {name : 'Flow 9', x : 0, y : 8, color : 'steelblue', link: [] },
    {name : 'Flow 10', x : 0, y : 9, color : 'steelblue', link: ['Flow 9'] },
];
assert.nodesEquals(textProcessor('Flow 1|flow\nFlow 2\nFlow 3\nFlow 4|flowstop\nFlow 5\nFlow 6|flow\nFlow 7\nFlow 8|flowstop\nFlow 9|flow\nFlow 10'), expected);

/** test link */
var expected = [
    {name : 'Link 1', x : 0, y : 0, color : 'steelblue', link: [] },
    {name : 'Link 2', x : 0, y : 1, color : 'steelblue', link: ['Link 1'] },
    {name : 'Link 3', x : 0, y : 2, color : 'steelblue', link: ['Link 1'] },
    {name : 'Link 4', x : 0, y : 3, color : 'steelblue', link: ['Link 3'] },
    {name : 'Link 5', x : 0, y : 4, color : 'steelblue', link: ['Link 3'] },
    {name : 'Link 6', x : 0, y : 5, color : 'steelblue', link: ['Link 1'] },
    {name : 'Link 7', x : 0, y : 6, color : 'steelblue', link: [] },
];
assert.nodesEquals(textProcessor('Link 1|mm\nLink 2\nLink 3|mm\nLink 4\nLink 5|mmstop\nLink 6|mmstop\nLink 7'), expected);

/** test colors */
var expected = [
    {name : 'Col 1', x : 0, y : 0, color : 'red', link: [] },
    {name : 'Col 2', x : 0, y : 1, color : 'red', link: [] },
    {name : 'Col 3', x : 0, y : 2, color : 'red', link: [] },
    {name : 'Col 4', x : 0, y : 4, color : 'yellow', link: [] },
    {name : 'Col 5', x : 0, y : 5, color : 'steelblue', link: [] },
];
assert.nodesEquals(textProcessor('Col 1|red;colfol\nCol 2\nCol 3\nCol 4|yellow\nCol 5'), expected);
