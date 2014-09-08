authentication-client-java
==========================

The Authentication Client Java API is for fetching the access token from the authentication server.

## Supported Actions

 - fetch an access token from the authentication server with credentials supported by the active authentication 
   mechanism;
 - check that authentication is enabled in the gateway server;
 - invalidate any cached access token;
 - retrieve credentials required by the authentication provider from the authentication server. 
 
 Current implementation supports three authentication mechanisms:
  - Basic Authentication;
  - LDAP;
  - JAASPI.
 
 Also, is possible to extend existing logic and implement a custom client for any other authentication 
 mechanisms. To create a new authentication client, implement the ```AuthenticationClient``` interface.   

## Build
 
 To build the Authentication Client Java API jar, use:

 ```mvn package``` or ``` mvn package -DskipTests```

## Usage

 To use the Authentication Client Java API, include this Maven dependency in your project's ```pom.xml``` file:
 
 <dependency>
  <groupId>co.cask.cdap</groupId>
  <artifactId>authentication-client-java</artifactId>
  <version>1.0-SNAPSHOT</version>
 </dependency>
 
## Example
   
 Create a ```BasicAuthenticationClient``` instance by full class name:
 
 ```
  String authClientClassName = "co.cask.cdap.security.authentication.client.basic.BasicAuthenticationClient";
  AuthenticationClient authenticationClient = configuration.getClassByName(authClientClassName);
 ```
 
 Set the gateway server connection info (this method needs calling only once for every ```AuthenticationClient``` 
 object):
  - the gateway server hostname;
  - the gateway server port;
  - the boolean flag, ```true``` if SSL is enabled in the gateway server.
 
 ```
  authenticationClient.setConnectionInfo("localhost", 10000, false);
 ```
  
 Configure the authentication client with additional properties (this method needs calling only once for every 
 ```AuthenticationClient``` object):
 
 ```
  authenticationClient.configure(properties);
 ```

 **Note:** The ```BasicAuthenticationClient``` supports these properties:
 
 ```
  security.auth.client.username=admin        
  security.auth.client.password=realtime     
 ```
 
 Check if authentication is enabled in the gateway server:
 
 ```
  boolean isEnabled = authenticationClient.isAuthEnabled();
 ```                      
 
 Get the access token for the user with *username:"admin"* and *password:"realtime"* from the authentication server:
 
 ```  
   String token = authenticationClient.getAccessToken();  
 ```
 If an access token is not available, an ```IOException``` will be thrown. 
 
 
 Invalidate an access token:
 
 ```
   authenticationClient.invalidateToken();
 ```
 
 Retrieve credentials required by the authentication provider from the authentication server:

 ```
   List<Credential> credentials = authenticationClient.getRequiredCredentials();
 ```
 **Note:** Interactive clients can use this list to obtain credentials from the user and then configure 
 the ```authenticationClient```:
 
 ```
   for(Credential cred : credentials) {
     config.set(credentials.getName(), credValue);
   }
   authenticationClient.configure(config);
 ```
   
## Additional Notes
 
 ```getAccessToken();``` methods from the ```BasicAuthenticationClient``` throw exceptions using response code 
 analysis from the authentication server. These exceptions help determine if the request was processed unsuccessfully 
 and for what reason.
 
 All cases, except a **200 OK** response, will throw these exceptions:
 
  - **400 Bad Request**: *javax.ws.rs.BadRequestException;*   
  - **401 Unauthorized**: *javax.ws.rs.NotAuthorizedException;*
  - **403 Forbidden**: *javax.ws.rs.ForbiddenException;*
  - **404 Not Found**: *co.cask.cdap.client.exception.NotFoundException/javax.ws.rs.NotFoundException;*
  - **405 Method Not Allowed**: *javax.ws.rs.NotAcceptableException;*
  - **409 Conflict**: *javax.ws.rs.NotAcceptableException;*
  - **500 Internal Server Error**: *javax.ws.rs.ServerErrorException;*
  - **501 Not Implemented**: *javax.ws.rs.NotSupportedException*.