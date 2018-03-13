/*eslint no-console: 0*/
const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const YAML = require('js-yaml');

let Default = function (DEFAULT_PATH_PATH, USER_CONFIG_PATH) {
    this.DEFAULT_PATH = DEFAULT_PATH_PATH;
    this.CONFIG_PATH = USER_CONFIG_PATH;
    this.ext = path.parse(this.CONFIG_PATH).ext.toLowerCase();
};

// initialize and validate configuration files
Default.prototype.init = function (callback) {
    let stat = fs.stat(this.CONFIG_PATH, function (err, stats) {
        if (err) {
            console.info('userconfig not exist, copy from default');
            this.copyDefault(function (error) {
                if (error) {
                    console.error(error);
                    callback(error);
                } else {
                    callback(null);
                }
            });
        } else {
            callback(null);
        }
    });
};
Default.prototype.initSync = function () {
    try {
        if (!fs.statSync(this.CONFIG_PATH)) {
            console.info('userconfig not exist, copy from default');
            this.copyDefaultSync();
        } else {
            // file exist, do nothing
        }
    } catch (e) {
        console.info('userconfig not exist, copy from default');
        this.copyDefaultSync();
    }
};

// make initial user configuration file from default configuration file
Default.prototype.copyDefaultSync = function () {
    try {
        fse.copySync(this.DEFAULT_PATH, this.CONFIG_PATH);
        return true;
    } catch (e) {
        console.error('copied default configuration file');
        throw e;
    }
};
Default.prototype.copyDefault = function (callback) {
    fse.copy(this.DEFAULT_PATH, this.CONFIG_PATH, function (error) {
        if (error) {
            console.error(error);
            return callback(error);
        } else {
            console.log('copied default configuration file');
            return callback();
        }
    });
};

// read whole config from configuration file
Default.prototype.readConfigsSync = function () {
    this.initSync();
    if (this.ext === '.json') {
        return fse.readJsonSync(this.CONFIG_PATH);
    } else if (this.ext === '.yaml' || this.ext === '.yml') {
        return YAML.safeLoad(fs.readFileSync(this.CONFIG_PATH, 'utf8', null, {json: true}));
    } else {
        console.log('invalid file extension : default.js support JSON, YAML, YML only');
        return undefined;
    }
};
Default.prototype.readConfigs = function (callback) {
    if (this.ext === '.json') {
        this.init(function (error, status) {
            if (error) {
                console.error(error, status);
                callback(error);
                return null;
            } else {
                fse.readJson(this.CONFIG_PATH, function (error, data) {
                    if (error) {
                        callback(error);
                        console.error(error);
                        return null;
                    } else {
                        callback(null, data);
                        return data;
                    }
                });
            }
        });
    } else if (this.ext === '.yaml' || this.ext === '.yml') {
        this.init(function (error, status) {
            if (error) {
                console.error(error, status);
                callback(error);
                return null;
            } else {
                return YAML.safeLoad(fs.readFileSync(this.CONFIG_PATH, 'utf8', null, {json: true}));
            }
        });
    } else {
        console.log('invalid file extension : default.js support JSON, YAML, YML only');
        callback(new Error());
        return false;
    }
};

// set config, key value input
Default.prototype.setConfigSync = function (key, value) {
    var settings = this.readConfigsSync();
    settings[key] = value;
    return this.setConfigsSync(settings);
};
Default.prototype.setConfig = function (key, value, callback) {
    this.readConfigs(function (error, data) {
        if (error) {
            callback(error);
            return false;
        } else {
            var settings = data;
            settings[key] = value;
            this.setConfigs(settings, function (err) {
                if (err) {
                    console.error(err);
                    callback(err);
                    return false;
                } else {
                    callback(null);
                    return true;
                }
            });
        }
    });
};

// set configs, json input
Default.prototype.setConfigsSync = function (settings) {
    if (this.ext === '.json') {
        return fse.writeJsonSync(this.CONFIG_PATH, settings);
    } else if (this.ext === '.yaml' || this.ext === '.yml') {
        return fs.writeFileSync(this.CONFIG_PATH, YAML.safeDump(settings), null);
    } else {
        console.log('invalid file extension : default.js support JSON, YAML, YML only');
        throw new Error('invalid file extension : default.js support JSON, YAML, YML only');
    }
};
Default.prototype.setConfigs = function (settings, callback) {
    if (this.ext === '.json') {
        fse.writeJson(this.CONFIG_PATH, settings, function (err) {
            if (err) {
                console.error(err);
                callback(err);
                return false;
            } else {
                return true;
            }
        });
    } else if (this.ext === '.yaml' || this.ext === '.yml') {
        fs.writeFile(this.CONFIG_PATH, YAML.safeDump(settings), null, function (err) {
            if (err) {
                console.error(err);
                callback(err);
                return false;
            } else {
                return true;
            }
        });
    } else {
        console.log('invalid file extension : default.js support JSON, YAML, YML only');
        callback(new Error());
        return false;
    }
};

module.exports = Default;
