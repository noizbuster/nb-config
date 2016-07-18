var config = require('./default');
var fse = require('fs-extra');
var TEST_DEFAULT_FILE_PATH = './tests/default_sample.json';
var TEST_CONFIG_FILE_PATH = './tests/user_config.json';

var TEST_DEFAULT_YAML_FILE_PATH = './tests/default_sample.yaml';
var TEST_CONFIG_YAML_FILE_PATH = './tests/user_config.yaml';

fse.removeSync(TEST_CONFIG_FILE_PATH);
fse.removeSync(TEST_CONFIG_YAML_FILE_PATH);

console.info('\nJSON test ===========================================================');
var configManager = new config(TEST_DEFAULT_FILE_PATH, TEST_CONFIG_FILE_PATH);
console.log('CONFIG: ', configManager.CONFIG_PATH);
console.log('DEFAULT: ', configManager.DEFAULT_PATH);

console.info('\nLoad default configuration file======================================');
configManager.initSync();

console.info('\nLoad again configuration file========================================');
configManager.initSync();

console.info('\nRead Configs=========================================================');
console.log(configManager.readConfigsSync());
console.info('\nset Configs==========================================================');
configManager.setConfigSync('testString', 'new value !!!');
console.log(configManager.readConfigsSync());

console.info('\nJDON Test Ended======================================================\n\n\n');


console.info('\nYAML test ===========================================================');
var yamlConfigManager = new config(TEST_DEFAULT_YAML_FILE_PATH, TEST_CONFIG_YAML_FILE_PATH);
console.log('CONFIG: ', yamlConfigManager.CONFIG_PATH);
console.log('DEFAULT: ', yamlConfigManager.DEFAULT_PATH);

console.info('\nLoad default configuration file======================================');
yamlConfigManager.initSync();

console.info('\nLoad again configuration file========================================');
yamlConfigManager.initSync();

console.info('\nRead Configs=========================================================');
console.log(yamlConfigManager.readConfigsSync());

console.info('\nset Configs==========================================================');
yamlConfigManager.setConfigSync('testString', 'new value !!!');
console.log(yamlConfigManager.readConfigsSync());

console.info('\nYAML Test Ended======================================================');