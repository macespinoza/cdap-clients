/**
 * Copyright © 2014 Cask Data, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

var Url = require('url'),
    Promise = require('./promise');

module.exports = {
    getAuthHeaders: function (headerName, authType, connectionInfo) {
        var obj = {};

        obj[headerName] = authType + ' ' + new Buffer(
                connectionInfo.user + ':' + connectionInfo.pass
        ).toString('base64');

        return obj;
    },
    fetchAuthUrl: function (httpConnection, baseUrl) {
        var promise = new Promise(),
            parsedUrl = Url.parse(baseUrl()),
            request = httpConnection.request({
                protocol: parsedUrl.protocol,
                host: parsedUrl.hostname,
                port: parsedUrl.port,
                path: '/v2/ping',
                method: 'GET'
            }, function (response) {
                response.setEncoding('utf8');

                response.on('data', function (chunk) {
                    if (401 === response.statusCode) {
                        promise.resolve(JSON.parse(chunk)['auth_uri']);
                    } else {
                        promise.resolve(null);
                    }
                });

                response.on('end', function () {
                    promise.resolve(null);
                });
            });

        request.on('error', function (error) {
            promise.resolve(null);
        });

        request.end();

        return promise;
    },
    fetchTokenInfo: function (authUrl, httpConnection, headers) {
        var promise = new Promise(),
            tokenInfo = {},
            parsedUrl = Url.parse(authUrl()),
            request = httpConnection.request({
                protocol: parsedUrl.protocol,
                host: parsedUrl.hostname,
                port: parsedUrl.port,
                path: parsedUrl.pathname,
                method: 'GET',
                headers: headers()
            }, function (response) {
                response.setEncoding('utf8');

                response.on('data', function (chunk) {
                    if (200 === response.statusCode) {
                        var tokenData = JSON.parse(chunk);

                        tokenInfo.value = tokenData.access_token;
                        tokenInfo.type = tokenData.token_type;
                        tokenInfo.expirationDate = Date.now() + (tokenData.expires_in * 1000);

                        promise.resolve(tokenInfo);
                    } else {
                        promise.reject(null);
                    }
                });
            });

        request.on('error', function (error) {
            promise.reject(null);
        });

        request.end();

        return promise;
    }
};
