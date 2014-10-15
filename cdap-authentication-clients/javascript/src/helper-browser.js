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
        httpConnection.open('GET', baseUrl(), false);
        httpConnection.send();

        var authUrls = null;
        if (XMLHttpRequest.DONE === httpConnection.readyState && 401 === httpConnection.status) {
            authUrls = JSON.parse(httpConnection.responseText)['auth_uri'];
        }

        return authUrls;
    },
    fetchTokenInfo: function (authUrl, httpConnection, headers, authHeaderName) {
        httpConnection.open('GET', authUrl(), false);
        httpConnection.setRequestHeader(authHeaderName, headers()[authHeaderName]);

        var tokenInfo = {
            value: '',
            type: '',
            expirationDate: 0
        };
        if (authUrl) {
            httpConnection.send();

            if (XMLHttpRequest.DONE === httpConnection.readyState && 200 === httpConnection.status) {
                var tokenData = JSON.parse(httpConnection.responseText);

                tokenInfo.value = tokenData.access_token;
                tokenInfo.type = tokenData.token_type;
                tokenInfo.expirationDate = Date.now() + (tokenData.expires_in * 1000);
            }
        }

        return tokenInfo;
    }
};