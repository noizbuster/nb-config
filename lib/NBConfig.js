const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const YAML = require('js-yaml');
const traverse = require('traverse');

const utils = require('./utils');
const verbose = utils.verbose;

/**
 * @typedef {object} NBConfigOptions
 * @property {string}  [configDir]      - default is env.NB_CONFIG_DIR || CWD() + /config
 * @property {string}  [defaultDir]     - default is env.NB_DEFAULT_DIR || this.configDir
 * @property {boolean} [cache=true]
 * @property {boolean} [env=true]
 * TODO below property is not implemented yet
 * @property {boolean} [auto]           - when configDir and defaultDir is not set, find it manually
 * @property {number}  [max_depth]      - maximum directory travel levels for "auto" feature
 */

class NBConfig {
    /**
     * @param {string} [moduleName]                 - default is package.name
     * @param {string} [buildTarget='development']
     * @param {NBConfigOptions} [options]
     */
    constructor(moduleName, buildTarget, options) {
        verbose('constructor: build target: ', buildTarget, process.env.NODE_ENV, 'development');
        /** @type {string} */
        this.moduleName = moduleName || require(path.join(process.cwd(), 'package.json')).name;
        /** @type {NBConfigOptions} */
        this.options = _.assign({env: true}, options);
        /** @type {boolean} */
        this.cache = _.get(options, 'cache') || true;
        /** @type {?string} */
        this.configDir = _.get(options, 'configDir') || process.env.NB_CONFIG_DIR || path.join(process.cwd(), 'config');
        /** @type {?string} */
        this.defaultDir = _.get(options, 'defaultDir') || process.env.NB_DEFAULT_DIR || this.configDir;
        /** @type {string} */
        this.buildTarget = buildTarget || process.env.NODE_ENV || 'development';

        this.load();

        return this;
    }

    static fileName(moduleName, buildTarget) {
        return moduleName
            ? moduleName.concat('.', buildTarget)
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
        const filename = NBConfig.fileName(this.moduleName, 'default') + '.yaml';
        const defaultFilePath = path.join(this.defaultDir, filename);
        const configDefaultPath = path.join(this.configDir, filename);

        // load both origin default file and default configuration file
        /**
         * @type {Buffer}
         */
        let originDefaultBuf = null;
        let destDefaultBuf = null;
        try {
            originDefaultBuf = fs.readFileSync(defaultFilePath);
        } catch (e) {
            verbose(e);
        }
        try {
            destDefaultBuf = fs.readFileSync(configDefaultPath);
        } catch (e) {
            verbose(e);
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
            verbose('default file is exist');
        }
    }

    /**
     * Load all config
     * If cache flag is true, load from cache
     * @public
     * @return {NBConfig}
     */
    load() {
        if (this.cache) {
            const cached = this.getCache();
            if (cached) {
                verbose('load from cache');
                this.config = cached;
                this.fromCache = true;
                return cached;
            }
        }
        this.fromCache = false;
        this.loadConfig();

        return this;
    }

    /**
     * @public
     * @return {NBConfig}
     */
    reload() {
        this.loadConfig();

        return this;
    }

    static loadFile(filePath) {
        try {
            return YAML.load(fs.readFileSync(filePath, 'utf8'), {json: true, filename: filePath});
        } catch (e) {
            verbose('file load failed', filePath);
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
        const defaultFileName = NBConfig.fileName(this.moduleName, 'default') + '.yaml';
        const defaultFilePath = path.join(this.configDir, defaultFileName);
        const defaultConfig = NBConfig.loadFile(defaultFilePath);

        // get user config
        const configFileName = NBConfig.fileName(this.moduleName, this.buildTarget) + '.yaml';
        const configFilePath = path.join(this.configDir, configFileName);
        const userConfig = NBConfig.loadFile(configFilePath);

        verbose('defaultFilePath', defaultFilePath);
        verbose('defaultConfig', defaultConfig);
        verbose('configFilePath', configFilePath);
        verbose('userConfig', userConfig);
        this.config = utils.extendDeep(defaultConfig, userConfig);
        verbose('merged:', this.config);
        if (this.options.env) {
            this.coatEnvOnConfig();
        }
        if (this.cache) {
            this.setCache(this.config);
        }

        return this;
    }

    getCache() {
        if (this.cache) {
            const symbolKey = Symbol.for(NBConfig.fileName(this.moduleName, this.buildTarget));
            let globalSymbols = Object.getOwnPropertySymbols(global);
            let cached = (globalSymbols.indexOf(symbolKey) > -1);
            if (cached) {
                verbose('get data from cache:', symbolKey);
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
        const symbolKey = Symbol.for(NBConfig.fileName(this.moduleName, this.buildTarget));
        global[symbolKey] = data;

        verbose('put data into cache:', symbolKey);
        return global[symbolKey];
    }

    clearCache(targetSymbolKey) {
        if (targetSymbolKey) {
            verbose('cache deleted:', targetSymbolKey);
            delete global[targetSymbolKey];
        } else {
            const symbolKey = Symbol.for(NBConfig.fileName(this.moduleName, this.buildTarget));
            verbose('cache deleted:', symbolKey);
            delete global[symbolKey];
        }
    }

    /**
     * return config value in path
     * if path is not valid, return undefined
     * @public
     * @param {string | array} [path]
     * @return {*}
     */
    get(path) {
        return path
            ? _.get(this.config, path)
            : this.config;
    }

    /**
     * @public
     * @param {string}  path
     * @return {string|undefined}
     */
    getFileConfig(path) {
        return path
            ? _.get(this.config, path)
            : this.config;
    }

    /**
     * @public
     * @param {string}              path
     * @param {function<string>}   [format]
     * @param {string}             [delimiter='.]
     * @param {string}             [replacer='__']
     */
    getEnvConfig(path, format, delimiter = '.', replacer = '__') {
        if (path === '' || !path) {
            return undefined;
        }
        if (typeof format === 'function') {
            path = format(path);
        }
        return process.env[path.replace(delimiter, replacer)];
    }

    /**
     * @param {function<string>}   [format]
     * @param {string}             [delimiter='.]
     * @param {string}             [replacer='__']
     */
    coatEnvOnConfig(format, delimiter = '.', replacer = '__') {
        const paths = traverse(this.config).paths().map((i) => i.join('.'));
        _.forEach(paths, (path) => {
            const env = this.getEnvConfig(path, format, delimiter, replacer);
            if (env === undefined) {
                return;
            }

            const value = this.getFileConfig(path);

            if (_.isArray(value)) {
                return _.set(this.config, path, JSON.parse(env));
            }

            if (!_.isObject(value)) {
                let v = env;
                switch (typeof value) {
                    case 'string':
                        break;
                    case 'number':
                        v = _.toNumber(env);
                        break;
                    case 'boolean':
                        v = (env === 'true');
                        break;
                }
                return _.set(this.config, path, v);
            }
        });
        return this.config;
    }
}

module.exports = NBConfig;
