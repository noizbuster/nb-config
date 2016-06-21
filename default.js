var path = require('path');
var fs = require('fs');
var fse = require('fs-extra');

//var DEFAULT_PATH = path.join(process.cwd(), DEFAULT_PATH);
//var CONFIG_PATH = path.join(process.cwd(), CONFIG_PATH);

var Default = function(DEFAULT_PATH_PATH, USER_CONFIG_PATH) {
    this.DEFAULT_PATH = DEFAULT_PATH_PATH;
    this.CONFIG_PATH = USER_CONFIG_PATH;
}

//Default.constructor = function(DEFAULT_PATH_PATH, USER_CONFIG_PATH) {
    //this.DEFAULT_PATH = DEFAULT_PATH_PATH;
    //this.CONFIG_PATH = USER_CONFIG_PATH;
//}

Default.prototype.init = function(callback) {
    var error;
    stat = fs.stat(this.CONFIG_PATH, function (err, stats) {
        error = err;
        if (err) {
            // TODO rename
            // TODO replace to async
            console.info('userconfig not exist, copy from default');
            this.copyDefaultSync();
        }
        else {
            console.info('userconfig exist');
        }
        callback(error, stat);
    });
}
Default.prototype.initSync = function() {
    console.log('try to init:', this.CONFIG_PATH);
    try{
        if (!fs.statSync(this.CONFIG_PATH)) {
            console.info('userconfig not exist, copy from default');
            // TODO rename
            this.copyDefaultSync();
        }
        else {
            console.info('userconfig exist');
        }
    }
    catch(e) {
        console.info('userconfig not exist, copy from default');
        this.copyDefaultSync();
    }
}
Default.prototype.copyDefaultSync = function () {
    fse.copySync(this.DEFAULT_PATH, this.CONFIG_PATH);
}
Default.prototype.copyDefault = function() {
}
Default.prototype.getConfigsSync = function () {
    this.initSync();
    console.log(this.CONFIG_PATH);
    return JSON.parse(fs.readFileSync(this.CONFIG_PATH));
}
Default.prototype.setConfig = function (key, value) {
    var tempFilePath = path.join(process.cwd(), this.CONFIG_PATH + '.temp');
    // fse.copySync(CONFIG_PATH, tempFilePath);
    var oldSettings = JSON.parse(fs.readFileSync(this.CONFIG_PATH));
    oldSettings[key] = value;
    fse.writeJsonSync(tempFilePath, oldSettings);
    fse.move(tempFilePath, this.CONFIG_PATH, {clobber: true}, function () {
        return false
    });
    return true;
}
Default.prototype.setConfigs = function (settings) {
    var tempFilePath = path.join(process.cwd(), this.CONFIG_PATH + '.temp');
    // fse.copySync(CONFIG_PATH, tempFilePath);
    var oldSettings = JSON.parse(fs.readFileSync(this.CONFIG_PATH));
    for (var key in settings) {
        oldSettings[key] = settings[key];
    }
    fse.writeJsonSync(tempFilePath, oldSettings);
    fse.move(tempFilePath, this.CONFIG_PATH, {clobber: true}, function () {
        return false
    });
}

module.exports = Default;
