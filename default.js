var path = require('path');
var fs = require('fs');
var fse = require('fs-extra');

var Default = function (DEFAULT_PATH_PATH, USER_CONFIG_PATH) {
    this.DEFAULT_PATH = DEFAULT_PATH_PATH;
    this.CONFIG_PATH = USER_CONFIG_PATH;
};

// initialize and validate configuration files
Default.prototype.init = function (callback) {
    stat = fs.stat(this.CONFIG_PATH, function (err, stats) {
        if (err) {
            console.info('userconfig not exist, copy from default');
            this.copyDefault(function (error) {
                if (error) {
                    console.error(error);
                    callback(error);
                }
                else {
                    callback(null);
                }
            });
        }
        else {
            console.info('userconfig exist');
            callback(null);
        }
    });
};
Default.prototype.initSync = function () {
    console.log('try to init:', this.CONFIG_PATH);
    try {
        if (!fs.statSync(this.CONFIG_PATH)) {
            console.info('userconfig not exist, copy from default');
            // TODO rename
            this.copyDefaultSync();
        }
        else {
            console.info('userconfig exist');
        }
    }
    catch (e) {
        console.info('userconfig not exist, copy from default');
        this.copyDefaultSync();
    }
};

// make initial user configuration file from default configuration file
Default.prototype.copyDefaultSync = function () {
    fse.copySync(this.DEFAULT_PATH, this.CONFIG_PATH);
};
Default.prototype.copyDefault = function () {
    fse.copy(this.DEFAULT_PATH, this.CONFIG_PATH, function (error) {
        if (error) {
            return console.error(error);
        }
        else {
            console.log("copied default configuration file");
        }
    });
};

// read whole config from configuration file
Default.prototype.readConfigsSync = function () {
    this.initSync();
    return fse.readJsonSync(this.CONFIG_PATH);
};
Default.prototype.readConfigs = function (callback) {
    this.init(function (error, status) {
        if (error) {
            console.error(error, status);
            callback(error);
            return null;
        }
        else {
            fse.readJson(this.CONFIG_PATH, function (error, data) {
                if (error) {
                    callback(error);
                    console.error(error);
                    return null;
                }
                else {
                    callback(null, data);
                    return data;
                }
            });
        }
    });
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
        }
        else {
            var settings = data;
            settings[key] = value;
            this.setConfigs(settings, function (err) {
                if (err) {
                    console.error(err);
                    callback(err);
                    return false;
                }
                else {
                    callback(null);
                    return true;
                }
            });
        }
    });
};

// set configs, json input
Default.prototype.setConfigsSync = function (settings) {
    var tempFilePath = path.join(this.CONFIG_PATH + '.temp');
    fse.writeJsonSync(tempFilePath, settings);
    fse.move(tempFilePath, this.CONFIG_PATH, {clobber: true}, function (err) {
        if (err) {
            return false;
        }
        else {
            return true;
        }
    });
};
Default.prototype.setConfigs = function (settings, callback) {
    var tempFilePath = path.join(this.CONFIG_PATH + '.temp');
    fse.writeJson(tempFilePath, settings, function (err) {
        if (err) {
            console.error(err);
            callback(err);
            return false;
        }
        else {
            fse.move(tempFilePath, this.CONFIG_PATH, {clobber: true}, function (err) {
                if (err) {
                    callback(err);
                    return false;
                }
                else {
                    callback(null);
                    return true;
                }
            });
        }
    });

};

module.exports = Default;
