export = NBConfig;
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
declare class NBConfig {
    static fileName(moduleName: any, buildTarget: any): any;
    static loadFile(filePath: any): any;
    /**
     * @param {string} [moduleName]                 - default is package.name
     * @param {string} [buildTarget='development']
     * @param {NBConfigOptions} [options]
     */
    constructor(moduleName?: string, buildTarget?: string, options?: NBConfigOptions);
    /** @type {string} */
    moduleName: string;
    /** @type {NBConfigOptions} */
    options: NBConfigOptions;
    /** @type {boolean} */
    cache: boolean;
    /** @type {?string} */
    configDir: string | null;
    /** @type {?string} */
    defaultDir: string | null;
    /** @type {string} */
    buildTarget: string;
    prepareDefault(): void;
    /**
     * Load all config
     * If cache flag is true, load from cache
     * @public
     * @return {NBConfig}
     */
    public load(): NBConfig;
    config: any;
    fromCache: boolean;
    /**
     * @public
     * @return {NBConfig}
     */
    public reload(): NBConfig;
    /**
     * load default and user config from files.
     * if cache flag is set, update cache also
     * @return {NBConfig}
     */
    loadConfig(): NBConfig;
    getCache(): any;
    /**
     * @param {object} data - config data
     * @return {*} - echo of data
     */
    setCache(data: object): any;
    clearCache(targetSymbolKey: any): void;
    /**
     * return config value in path
     * if path is not valid, return undefined
     * @public
     * @param {string | array} [path]
     * @return {*}
     */
    public get(path?: string | any[]): any;
    /**
     * @public
     * @param {string}  path
     * @return {string|undefined}
     */
    public getFileConfig(path: string): string | undefined;
    /**
     * @public
     * @param {string}              path
     * @param {function<string>}   [format]
     * @param {string}             [delimiter='.]
     * @param {string}             [replacer='__']
     */
    public getEnvConfig(path: string, format: any, delimiter?: string, replacer?: string): any;
    /**
     * @param {function<string>}   [format]
     * @param {string}             [delimiter='.]
     * @param {string}             [replacer='__']
     */
    coatEnvOnConfig(format: any, delimiter?: string, replacer?: string): any;
}
declare namespace NBConfig {
    export { NBConfigOptions };
}
type NBConfigOptions = {
    /**
     * - default is env.NB_CONFIG_DIR || CWD() + /config
     */
    configDir?: string;
    /**
     * - default is env.NB_DEFAULT_DIR || this.configDir
     */
    defaultDir?: string;
    cache?: boolean;
    /**
     * TODO below property is not implemented yet
     */
    env?: boolean;
    /**
     * - when configDir and defaultDir is not set, find it manually
     */
    auto?: boolean;
    /**
     * - maximum directory travel levels for "auto" feature
     */
    max_depth?: number;
};
