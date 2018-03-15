const _ = require('lodash');

function extendDeep(defaultObj, configObj) {
    if (_.isArray(defaultObj) && _.isArray(configObj)) {
        return configObj;
    } else if (typeof(defaultObj) === 'object' && typeof(configObj) === 'object') {
        return _.assignWith(defaultObj, configObj, extendDeep);
    } else if (typeof(defaultObj) === 'undefined') {
        console.warn('config', configObj + '(' + typeof(configObj) + ')', 'is not defined on default');
        return configObj;
    } else if (typeof(defaultObj) !== typeof(configObj)) {
        console.warn('config type missmatch, default is', defaultObj + '(' + typeof(defaultObj) + ')', 'but config is', configObj + '(' + typeof(configObj) + ')');
        return defaultObj;
    } else {
        return configObj;
    }
}

module.exports = {
    extendDeep: extendDeep
};
