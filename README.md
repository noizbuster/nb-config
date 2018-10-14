# nb-config
Simple server-side file-based configuration manager  

### Main Feature
* Easy to Use
* Separated default configuration for docker deployment(data volume)
* Running Target
* Caching: You can use the config as an instance as well as a singleton.

### Planned Feature
* Support various file extension

# Usage

### Installation
```bash
npm install nb-config --save

```

## Basic Usage

__DEFAULT FILE: ./config/default.js__
```yaml
value1: hello
value2: world
```

__CONFIG FILE: ./config/development.js__
```yaml
value1: hi
```


__./your.js__
```javascript
const Config = require('nb-config');
let config = new Config();
 
console.log(config.get('value1'), config.get('value2'));
```

__output__
```bash
# node your.js
hi world
```

## Working with some parameters

__example project directory__  
|/  
|--src/  
|----your.js  
|--config/  
|----myProject.default.yaml  
|----myProject.development.yaml  
|----myProject.production.yaml

load configuration with specific __moduleName__(default: name field on package.json) and __runningTarget(default is 'development')__ 
```javascript
const Config = require('nb-config');
let config = new Config('myProject', 'production');
 
// config will contains data in myProject.default.js + myProject.production.yaml
```

runningTarget could be replace with environment NODE_ENV
```javascript
const Config = require('nb-config');
let config = new Config('myProject');
 
// test with NODE_ENV=production node ./src/your.js
// will returns same value with above example
```

## For docker deployment

__example project directory__
|/  
|--src/  
|----your.js  
|--config/  
|----myProject.development.yaml  
|----myProject.production.yaml
|--myProject.default.yaml

__docker dataVolume__ : /host/myProject/config:/container/config
|config/  
|--myProject.development.yaml  
|--myProject.production.yaml  

Once the data volume is mounted in the container, all of the files in the container will be erased.  
The problem is even default file also will be erased.

In this case nb-config will useful.

```javascript
const Config = require('nb-config');
let config = new Config('myProject', null, {
    defaultDir: process.cwd()
});
```
After data-volume mounted, nb-config will copy `./myProject.default.yaml` into empty `/config` directory  
Now, docker host can see full schemed default file in data-volume

# Specification

## Environment Variables

* NODE_ENV: runningTarget, see [NBCofig](#class-nbconfig) 
* NB_CONFIG_DIR: directory where configurations stored
* NB_DEFATUL_DIR: directory where default file stored

## class NBConfig
__constructor(['moduleName'], ['runningTarget'], [{options}])__  
initialize and load configurations

### (optional) moduleName
If this field specified, NBConfig will use this moduleName as prefix of configuration files
```
// it will load default.yaml + development.yaml
let config1 = new NBConfig();
 
// it will load myProject.default.yaml + myProject.development.yaml
let config2 = new NBConfig('myProject'); 
```

### (optional) runningTarget
__Order of reading runningTarget__
1. parameter on constructor
1. environment variable: __NODE_ENV__ (process.env.NODE_ENV)
1. default is __'development'__

Once the value is found, the rest is passed.

### (optional) options

* cache: (boolean) mark use cache or not (default is true).
* configDir: (string) directory where configurations stored
    * Loading Order: `options.configDir` > process.env.`NB_CONFIG_DIR` > `process.cwd()/config`(as default)
* defaultDir: (string) directory where *.default.ext file stored
    * Loading Order: `options.defualtDir` > process.env.`NB_DEFAULT_DIR` > `same value as configDir`(as default)

# License
Copyright 2016 Noizbuster \<noizbuster@noizbuster.com\>

Licensed under the Apache License, Version 2.0 (the "License");  
you may not use this file except in compliance with the License.  
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0
