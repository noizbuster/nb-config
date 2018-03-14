const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const YAML = require('js-yaml');
const utils = require('utils');

/**
 * @typedef {object} NBConfigOptions
 * @property {string} [configDir] - default is env.NB_CONFIG_DIR || CWD() + /config
 * @property {string} [defaultDir] - default is env.NB_DEFAULT_DIR || this.configDir
 * @property {string} [buildTarget] - default is 'development'
 * @property {boolean} [cache] - default is true
 * TODO below property is not implemented yet
 * @property {boolean} [auto] - when configDir and defaultDir is not set, find it manually
 * @property {number} [max_depth] - maximum directory travel levels for "auto" feature
 */

class NBConfig {
    /**
     * @param {string} buildTarget
     * @param {string} [moduleName]
     * @param {NBConfigOptions} [options]
     */
    constructor(buildTarget, moduleName, options) {
        this.buildTarget = buildTarget;
        this.moduleName = moduleName;
        this.options = options;
        this.cache = _.get(options, 'cache') || true;
        this.configDir = _.get(options, 'configDir') || process.env.NB_CONFIG_DIR || path.join(process.cwd(), 'config');
        this.defaultDir = _.get(options, 'defaultDir') || process.env.NB_DEFAULT_DIR || this.configDir;
        this.buildTarget = _.get(options, 'buildTarget') || process.env.NODE_ENV || 'development';

        this.load();

        return this;
    }

    static fileName(buildTarget, moduleName) {
        return moduleName
            ? moduleName.join(buildTarget, '.')
            : buildTarget;
    }

    prepareDefault() {
        // The directory where the configuration files are stored

        // convert relative path to absolute path
        if (this.defaultDir.indexOf('.') === 0) {
            this.defaultDir = path.join(process.cwd(), this.defaultDir);
        }
        if (this.configDir.indexOf('.') === 0) {
            this.configDir = path.join(process.cwd(), this.configDir);
        }

        // filepath
        // TODO support other extensions (not only yaml)
        const filename = NBConfig.fileName('default', this.moduleName) + '.yaml';
        const defaultFilePath = path.join(this.defaultDir, filename);
        const configDefaultPath = path.join(this.configDir, filename);

        // load both origin default file and default configuration file
        let originDefaultBuf = null;
        let destDefaultBuf = null;
        try {
            originDefaultBuf = fs.readFileSync(defaultFilePath);
        } catch (e) {
            console.log(e);
        }
        try {
            destDefaultBuf = fs.readFileSync(configDefaultPath);
        } catch (e) {
            console.log(e);
        }

        // check default files
        if (!originDefaultBuf) {
            console.warn('default file does not exist. load configuration without default');
        } else if (!destDefaultBuf) {
            fs.copyFileSync(defaultFilePath, configDefaultPath);
            console.info('default file in config directory is not exist. generate it from default');
        } else if (!originDefaultBuf.equals(destDefaultBuf)) {
            fs.copyFileSync(defaultFilePath, configDefaultPath);
            console.info('default file in config directory is not fresh. update it to new version');
        } else {
            console.info('default file is exist');
        }
    }

    /**
     * Load all config
     * If cache flag is true, load from cache
     * @return {*}
     */
    load() {
        this.prepareDefault();
        if (this.cache) {
            const cached = this.getCache();
            if (cached) {
                this.config = cached;
                return cached;
            }
        }
        this.loadConfig();

        return this;
    }

    reload() {
        this.loadConfig();

        return this;
    }

    static loadFile(filePath) {
        try {
            return YAML.safeLoad(fs.readFileSync(filePath, 'utf8'), {json: true, filename: filePath});
        } catch (e) {
            console.log('file load failed', filePath);
            return {};
        }
    }

    /**
     * load default and user config from files.
     * if cache flag is set, update cache also
     * @return {NBConfig}
     */
    loadConfig() {
        this.prepareDefault();
        // TODO support more extensions (not only yaml)

        // get default config
        const defaultFileName = NBConfig.fileName('default', this.moduleName) + '.yaml';
        const defaultFilePath = path.join(this.configDir, defaultFileName);
        const defaultConfig = NBConfig.loadFile(defaultFilePath);

        // get user config
        const configFileName = NBConfig.fileName(this.buildTarget, this.moduleName) + '.yaml';
        const configFilePath = path.join(this.configDir, configFileName);
        const userConfig = NBConfig.loadFile(configFilePath);

        this.config = utils.extendDeep(defaultConfig, userConfig);
        if (this.cache) {
            this.setCache(this.config);
        }

        return this;
    }

    getCache() {
        if (this.cache) {
            const symbolKey = Symbol.for(NBConfig.fileName(this.buildTarget, this.moduleName));
            let globalSymbols = Object.getOwnPropertySymbols(global);
            let cached = (globalSymbols.indexOf(symbolKey) > -1);
            if (cached) {
                return global[symbolKey];
            } else {
                return undefined;
            }
        } else {
            return null;
        }
    }

    /**
     * @param {object} data - config data
     * @return {*} - echo of data
     */
    setCache(data) {
        const symbolKey = Symbol.for(NBConfig.fileName(this.buildTarget, this.moduleName));
        global[symbolKey] = data;

        return global[symbolKey];
    }

    /**
     * return config value in path
     * if path is not valid, return undefined
     * @param {string | array} [path]
     * @return {*}
     */
    get(path) {
        return path
            ? this.config
            : _.get(this.config, path);
    }
}

module.exports = NBConfig;
