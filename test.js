var ep = require('./index.js');
var assert = require('assert');

ep(183442, (actual) => {
    var expected = {
        name: 'CONNOR MCDAVID',
        birthday: new Date(1997, 1, 13),
        position: 'C',
        height: 73,
        weight: 195,
    }
    assert.equal(actual.name, expected.name, assertMessage('McDavid.name', expected.name, actual.name));
    assert.deepEqual(actual.birthday, expected.birthday, assertMessage('McDavid.birthday', expected.birthday, actual.birthday));
    assert.equal(actual.position, expected.position, assertMessage('McDavid.position', expected.position, actual.position));
    assert.equal(actual.height, expected.height, assertMessage('McDavid.height', expected.height, actual.height));
});
ep(100479, (info) => assert.deepEqual(info, {
    name: 'PATRIK BARTOSAK',
    birthday: new Date(1993, 3, 29),
    position: 'G',
    height: 73,
    weight: 194,
}));

function assertMessage(field, expected, actual)
{
    var message = 'Field: ' + field + '\n';
    message += 'Expected: ' + expected + '\n';
    message += 'Got: ' + actual + '\n';
    return message;
}
