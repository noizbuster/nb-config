const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const YAML = require('js-yaml');

/**
 * @typedef {object} NBConfigOptions
 * @property {string} [configDir]
 * @property {string} [defaultDir]
 * @property {string} [buildTarget]
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
        this.configDir = _.get(options, 'configDir') || process.env.NB_CONFIG_DIR || path.join(process.cwd(), 'config');
        this.defaultDir = _.get(options, 'defaultDir') || process.env.NB_DEFAULT_DIR || this.configDir;
        this.buildTarget = _.get(options, 'buildTarget') || process.env.NODE_ENV || 'development';

        this.load();
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
        const filename = this.fileName('default', this.moduleName) + '.yaml';
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

    load() {
        if (_.get(this.options, 'cache')) {

            const symbolKey = Symbol.for(NBConfig.fileName(this.buildTarget, this.moduleName));

            // check if the global object has this symbol
            // add it if it does not have the symbol, yet
            // ------------------------------------------

            let globalSymbols = Object.getOwnPropertySymbols(global);
            let cached = (globalSymbols.indexOf(symbolKey) > -1);

            if (!cached) {
                //load data on cached
            } else {
                this.config = global[symbolKey];
                return this.config;
            }
        } else {

        }
    }

    reload() {
        this.loadDefault();
        this.loadConfig();
    }

    loadDefault() {
        this.prepareDefault();
        // TODO support more extensions (not only yaml)
        const filename = this.fileName('default', this.moduleName) + '.yaml';
        const configDefaultPath = path.join(this.configDir, filename);

        const config = YAML.safeLoad(fs.readFileSync(configDefaultPath, 'utf8'), {
            json: true,
            filename: configDefaultPath
        });
        this.config = config;
    }

    loadConfig() {
        // TODO support more extensions (not only yaml)
        const filename = this.fileName(this.buildTarget, this.moduleName) + '.yaml';
        const configPath = path.join(this.configDir, filename);

        const config = YAML.safeLoad(fs.readFileSync(configPath, 'utf8'), {json: true, filename: configPath});
        this.config = _.merge()
    }
}

module.exports = NBConfig;
