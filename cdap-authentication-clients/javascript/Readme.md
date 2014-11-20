# CDAP Client JavaScript library

Authentication client JavaScript API for CASK reactor.

## Supported Actions

- checking if authentication is available from the server side.
- authentication

## Installation

### Web browser
Copy ```<project_root>/dist/browser/cdap-auth-client.min.js``` to project depends on it.

### NodeJS
1. Copy ```<project_root>/dist/nodejs/cdap-auth-client``` to ```node_modules``` directory
of your project.
2. ```cd <you_project_root>/node_modules/cdap-auth-client```.
3. ```npm install```. This command will install all dependencies for ```cdap-auth-client```.

## Usage

 To use the Authentication client JavaScript API, include these script tag in your index.html:

### Web browser:
```
<script type="text/javascript" src="cdap-auth-client.min.js"></script>
```

### Node.JS:
```
var CDAPAuthManager = require('cdap-auth-client');
```

## Tracker object
Methods:

'isAuthEnabled()'    - checks if authentication is enabled from the server side.
                       Returns: true/false
'getToken()'         - authenticates and returns token info.
                       Returns: {
                           token: '',        - token value
                           type: ''          - token type. Currently 'Bearer' is only supported.
                       }
'configure(config)'  - sets up username and password for authentication manager.
                       config - {
                           username: '',
                           password: ''
                       }
'setConnectionInfo(hostname, port, ssl) - sets up connection data.

## Example

Create a ```CDAPAuthManager``` instance, specifying the 'username' and 'password' fields. 
Optional configurations that can be set (and their default values):

  - host: 'localhost' (DNS name or IP-address of the Reactor gateway server.)
  - port: 10000 (Number of a port the Reactor gateway server works on)
  - ssl: False (use HTTP protocol)

```

    var manager = new CDAPAuthManager(),
        tokenInfo;

    manager.configure({
        username: 'username',
        password: 'password'
    });
    manager.setConnectionInfo('localhost', 10000, false);

    var tokenPromise = authManager.getToken();
    tokenPromise.then(function (token) {
        //do something with token
    });
```