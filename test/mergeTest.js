const _ = require('lodash');
const utils = require('./../src/utils');

let defaultObj = {
    value1: 'value1',
    value2: 'defaultvalue2',
    valueA: ['defaultarr1', 'defaultarr2', 'defaultarr3'],
    valueDeep: {
        valueAD: ['deep', 'value', 'also', 'removed'],
        valueD: 'valueDeep',
        valueI: 10
    }
};

let configObj = {
    value2: 'value2',
    valueA: ['arr1', 'arr2'],
    valueDeep: {
        valueAD: ['deepArr1', 'deepArr2'],
        valueI: '123'
    },
    valueN: 'newValue'
};

// const defaultMethod = _.assignWith(defaultObj, configObj, function (obj, src) {
//     return _.assign(obj, src);
// });
const defaultMethod = utils.extendDeep(defaultObj, configObj);

console.log('default', JSON.stringify(defaultMethod, null, 4));
