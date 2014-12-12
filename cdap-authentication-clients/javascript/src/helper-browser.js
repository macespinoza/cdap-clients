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

window.CDAPAuthHelpers = window.CDAPAuthHelpers || {};

window.CDAPAuthHelpers.Browser = {
    getAuthHeaders: function (headerName, authType, connectionInfo) {
        var obj = {};

        obj[headerName] = authType + ' ' + Base64.encode(
                connectionInfo.user + ':' + connectionInfo.pass
        );

        return obj;
    },
    fetchAuthUrl: function (httpConnection, baseUrl) {
        var promise = new CDAPAuth.Promise();

        httpConnection.onreadystatechange = function () {
            if (XMLHttpRequest.DONE === httpConnection.readyState && 401 === httpConnection.status) {
                promise.resolve(JSON.parse(httpConnection.responseText)['auth_uri']);
            } else if(XMLHttpRequest.DONE === httpConnection.readyState && 401 !== httpConnection.status) {
                promise.resolve(null);
            }
        };
        httpConnection.open('GET', baseUrl() + '/v2/ping', true);
        httpConnection.send();

        return promise;
    },
    fetchTokenInfo: function (authUrl, httpConnection, headers, authHeaderName) {
        var promise = new CDAPAuth.Promise();

        httpConnection.onreadystatechange = function () {
            var tokenInfo = {
                value: '',
                type: '',
                expirationDate: 0
            };

            if (XMLHttpRequest.DONE === httpConnection.readyState && 200 === httpConnection.status) {
                var tokenData = JSON.parse(httpConnection.responseText);

                tokenInfo.value = tokenData.access_token;
                tokenInfo.type = tokenData.token_type;
                tokenInfo.expirationDate = Date.now() + (tokenData.expires_in * 1000);

                promise.resolve(tokenInfo);
            } else if (XMLHttpRequest.DONE === httpConnection.readyState && 200 !== httpConnection.status) {
                promise.reject(null);
            }
        };
        httpConnection.open('GET', authUrl(), true);
        httpConnection.setRequestHeader(authHeaderName, headers[authHeaderName]);

        if (authUrl()) {
            httpConnection.send();
        }

        return promise;
    }
};