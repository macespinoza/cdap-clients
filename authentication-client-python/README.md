# The Authentication Client Python API is for fetching the access token from the authentication server.

Authentication Client Python API for supporting via external Python applications.

## Supported Actions

 - fetch a access token from the authentication server with credentials, which are supported by the active 
 authentication mechanism;
 - check is the authentication enabled in the gateway server;
 - invalidate cached access token. 
 
 Current implementation supports three authentication mechanisms:
  - Basic Authentication;
  - LDAP;
  - JAASPI.

## Usage

 To use the Authentication Client Python API, include these imports in your Python script:

```
    from Config import Config
    from BasicAuthenticationClient import BasicAuthenticationClient
```

## Example
   
 Create a ```BasicAuthenticationClient``` instance,
 
 ```
   authentication_client = BasicAuthenticationClient()
 ```
      
 Set connection parameters: authentication server host, authentication server host port, SSL mode
 
 ```
   authentication_client.set_connection_info('localhost', 10000, False)
 ```
 
 Create configuration file structure in JSON format:
 ```
  {
    "security_auth_client_username": "admin",
    "security_auth_client_password": "secret",
    "security_ssl_cert_check": "true" 
  }
 ```  
 
 Load configuration from JSON File:
 ```
 config = Config().read_from_file('auth_config.json')
 ```
 
 Or set required field to Config object:
 ```
 config = Config()
 config.security_auth_client_username = "admin"
 config.security_auth_client_password = "secret"
 config.security_ssl_cert_check = "true"
 ```
 
 Configure authentication client with Config object:
 ```
 authentication_client.configure(config)
 ```
 Check is authentication enabled in the gateway server:
 
 ```
  is_enabled = authenticationClient.is_auth_enabled();
 ``` 
                      
 Get access token from the authentication server:
 ```
 token = authenticationClient.get_access_token();  
 ```



 