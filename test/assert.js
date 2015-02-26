
var assert = {};

assert.fail = function(actual, expected, message) {
    message = message.replace("{actual}", actual);
    message = message.replace("{expected}", expected);
    console.error(message);
};

assert.success = function() {
    process.stdout.write('.');
};

assert.arrayEquals = function(actual, expected, message) {
    if (actual.length != expected.length) {
        assert.fail(actual.lenth, expected[0], 'The size of array is not equals {actual} != {expected}');
    }

    for (var i in actual) {
        if (actual[i] != expected[i]) {
            assert.fail(actual[i], expected[i], 'expected {actual} to be {expected} in array in index ' + i);
            break;
        }
    }
};

assert.nodeEquals = function(actual, expected, message) {

    if (actual.name !== expected.name) {
        assert.fail(actual.name, expected.name, 'expected "{actual}" same as "{expected}" for the name of the node');
    }

    if (actual.x != expected.x) {
        assert.fail(actual.x, expected.x, 'expected "{actual}" same as "{expected}" for the x of the node ' + actual.name);
    }

    if (actual.y != expected.y) {
        assert.fail(actual.y, expected.y, 'expected "{actual}" same as "{expected}" for the y of the node ' + actual.name);
    }

    if (actual.color != expected.color) {
        assert.fail(actual.color, expected.color, 'expected "{actual}" same as "{expected}" for the color of the node ' + actual.name);
    }

    assert.arrayEquals(actual.link, expected.link);

    assert.success();
};

assert.nodesEquals = function(actual, expected) {
    for (var i in actual) {
        assert.nodeEquals(actual[i], expected[i]);
    }
    assert.success();
};


module.exports = assert;
