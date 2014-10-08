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

module.exports = {
    getAuthHeaders: function (headerName, authType, connectionInfo) {
        var obj = {};

        obj[headerName] = authType + ' ' + new Buffer(
                connectionInfo.user + ':' + connectionInfo.pass
        ).toString('base64');

        return obj;
    },
    fetchAuthUrl: function (httpConnection, baseUrl) {
        var authUrls = null,
            request = httpConnection.request({
                url: baseUrl,
                method: 'GET'
            }),
            response = request.end();

        if (401 === response.status) {
            authUrls = JSON.parse(response.data)['auth_uri'];
        }

        return authUrls;
    },
    fetchTokenInfo: function (authUrl, httpConnection, headers) {
        var tokenInfo = {},
            __authUrl = authUrl();

        if (__authUrl) {
            var request = httpConnection.request({
                    url: __authUrl,
                    method: 'GET',
                    headers: headers()
                }),
                response = request.end();

            if (200 === response.status) {
                var tokenData = JSON.parse(response.data);

                tokenInfo.value = tokenData.access_token;
                tokenInfo.type = tokenData.token_type;
                tokenInfo.expirationDate = Date.now() + (tokenData.expires_in * 1000);
            }
        }

        return tokenInfo;
    }
};
