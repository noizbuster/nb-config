const _ = require('lodash');

function extendDeep(defaultObj, configObj) {
    if (_.isArray(defaultObj) && _.isArray(configObj)) {
        return configObj;
    } else if (typeof (defaultObj) === 'object' && typeof (configObj) === 'object') {
        return _.assignWith(defaultObj, configObj, extendDeep);
    } else if (typeof (defaultObj) === 'undefined') {
        console.warn(`nb-config ${configObj} (${typeof (configObj)}) is not defined on default`);
        return configObj;
    } else if (typeof (defaultObj) !== typeof (configObj)) {
        console.warn(`nb-config type mismatch, default is ${defaultObj}(${typeof (defaultObj)})`
            + `but config is ${configObj} (${typeof (configObj)})`);
        return defaultObj;
    } else {
        return configObj;
    }
}

function verbose() {
    if (process.env.NB_CONFIG_VERBOSE) {
        console.log('VERBOSE OUTPUT ON');
        return console.log;
    } else {
        return function () {
        };
    }
}

module.exports = {
    extendDeep: extendDeep,
    verbose: verbose()
};
