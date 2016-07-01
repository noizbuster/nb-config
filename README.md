# default.js
simple file-based default configuration manager for using docker's data volume

---

# Usage

## Import
```
var defaultjs = require('default.js');
```

## Initialize
#### new defaultjs(defaultConfigFilePath, userConfigFilePath);
```
var serverConfigManager = new defaultjs(
                './config/defaultConfig.json',
                './config/userConfig/serverConfig.json');
```

## read configurations
```
var serverConfig = serverConfigManager.readConfigsSync();
console.log(serverConfig.somefield);
```

---

## Methods
* [initSync()](#initsync)
* [init()](#initsync)
* [copyDefaultSync()](#copydefaultsync)
* [copyDefault()](#copydefaultsync)
* [readConfigsSync()](#readconfigssync)
* [readConfigs()](#readconfigssync)
* [setConfigSync()](#setconfigssync)
* [setConfig()](#setconfigssync)
* [setConfigsSync()](#setconfigsync)
* [setConfigs()](#setconfigsync)

---

### initSync()
#### initSync();
validate current configuration file  
and initialize new configuration

### init()
#### init(callback);
validate current configuration file  
and initialize new configuration

__callback(error, data)__

---

### copyDefaultSync()
#### copyDefaultSync();
copy defaultConfigFile to userConfigFile

### copyDefault()
#### copyDefault(callback);
copy defaultConfigFile to userConfigFile

__callback(error, data)__

---

### readConfigsSync()
#### readConfigsSync();
read configuration from userConfigFile  
__return__ : configuration json

Example:
```

```

### readConfigs()
#### readConfigs(callback)
read configuration from userConfigFile  

* __callback(error, data)__  
    * parameters
        * error
        * data : configs json


---

### setConfigSync()
#### setConfigSync(key, value);
set key-value configuration to userConfigFile  

### setConfig()
#### setConfig(key, value, callback));
set key-value configuration to userConfigFile  
__callback(error)__  
Example :
```
```

---

### setConfigsSync()
#### setConfigsSync(configs);
set json configuration set to userConfigFile  

### setConfigs()
#### setConfigs(configs, callback);
set json configuration set to userConfigFile  
__callback(error)__  
Example :
```
```

make a user-config file from the default-configuration file

---

# Linkage with Docker
```
docker run -ti (imageName) -v CustomConfigurationFilePath(host):userConfigPath(in the container)
```

---

# License
Copyright 2016 Noizbuster \<noizbuster@noizbuster.com\>

Licensed under the Apache License, Version 2.0 (the "License");  
you may not use this file except in compliance with the License.  
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0
