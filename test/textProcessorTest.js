assert = require('./assert.js');

textProcessor = require('../src/textProcessor.js');

/** test simple */
var expected = [{name : 'Hello', x : 0, y : 0, color : 'steelblue', link: [] }];
assert.nodesEquals(textProcessor('Hello'), expected);

expected.push({name : 'Hi', x : 0, y : 1, color : 'steelblue', link : [] });
assert.nodesEquals(textProcessor('Hello\nHi'), expected);

expected.push({name : 'TestColor', x : 0, y : 2, color : 'red', link : [] });
expected.push({name : 'TestColor2', x : 0, y : 3, color : 'red', link : [] });
assert.nodesEquals(textProcessor('Hello\nHi\nTestColor:red\nTestColor2'), expected);


/** test position horizontal */
var expected = [
    {name : 'Pos1', x : 0, y : 0, color : 'steelblue', link: [] },
    {name : 'Pos2', x : 1, y : 0, color : 'steelblue', link: [] },
    {name : 'Pos3', x : 2, y : 0, color : 'steelblue', link: [] },
    {name : 'Pos4', x : 3, y : 0, color : 'steelblue', link: [] },
];
assert.nodesEquals(textProcessor('Pos1,_,0\nPos2\nPos3\nPos4'), expected);

/** test link */
var expected = [
    {name : 'Link 1', x : 0, y : 0, color : 'steelblue', link: [] },
    {name : 'Link 2', x : 0, y : 1, color : 'steelblue', link: ['Link 1'] },
    {name : 'Link 3', x : 0, y : 2, color : 'steelblue', link: ['Link 1'] },
    {name : 'Link 4', x : 0, y : 3, color : 'steelblue', link: ['Link 1'] },
];
assert.nodesEquals(textProcessor('Link 1:link\nLink 2\nLink 3\nLink 4'), expected);


/** test flow */
var expected = [
    {name : 'Flow 1', x : 0, y : 0, color : 'steelblue', link: [] },
    {name : 'Flow 2', x : 0, y : 1, color : 'steelblue', link: ['Flow 1'] },
    {name : 'Flow 3', x : 0, y : 2, color : 'steelblue', link: ['Flow 2'] },
    {name : 'Flow 4', x : 0, y : 3, color : 'steelblue', link: ['Flow 3'] },
];
assert.nodesEquals(textProcessor('Flow 1:flow\nFlow 2\nFlow 3\nFlow 4'), expected);
