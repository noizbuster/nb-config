var config = require('./default');

var TEST_DEFAULT_FILE_PATH = './tests/default_sample.json';
var TEST_CONFIG_FILE_PATH = './tests/user_config.json';

var configManager = new config(TEST_DEFAULT_FILE_PATH, TEST_CONFIG_FILE_PATH);
configManager.initSync();
console.log('CONFIG: ', configManager.CONFIG_PATH);
console.log('DEFAULT: ', configManager.DEFAULT_PATH);
var configs = configManager.getConfigsSync();
console.log(configs);

configManager.setConfigSync("testString", 'new value !!!');
var configse = configManager.getConfigsSync();
console.log(configse);
