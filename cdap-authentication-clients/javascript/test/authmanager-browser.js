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

describe('CDAP Auth manager tests', function () {
    beforeEach(function () {
/*        sinon.log = function (data) {
            console.log(data);
        };*/
        this.server = sinon.fakeServer.create();
        this.server.autoRespond = true;
    });

    afterEach(function () {
        this.server.restore();
    });

    describe('Checking Auth Manager functionality', function () {
        it('Constructor creates correct object', function () {
            var authManager = new CDAPAuth.Manager();

            authManager.configure({username: 'username', password: 'password'});

            expect(authManager).to.be.an('object');
            expect(authManager).to.have.property('isAuthEnabled');
            expect(authManager).to.have.property('getToken');
            expect(authManager).to.have.property('configure');
            expect(authManager).to.have.property('setConnectionInfo');
            expect(authManager).to.have.property('getRequiredCredentials');
            expect(authManager).to.have.property('invalidateToken');
        });

        it('"configure" method could not be called without "username" or "password" field', function () {
            var authManager = new CDAPAuth.Manager();
            expect(function () {
                authManager.configure({});
            }).to.throwException(function (e) {
                    expect(e).to.be.an(Error);
                });
        });

        it('Authentication is disabled on server side.', function (done) {
            this.server.respondWith([200, {'Content-Type': 'application/json'}, '']);

            var authManager = new CDAPAuth.Manager(),
                authEnabled = false,
                promise = null,
                checker = function () {
                    expect(authEnabled).not.to.be.ok();
                    done();
                };

            authManager.configure({username: 'username', password: 'password'});
            promise = authManager.isAuthEnabled();
            promise.then(function (isEnabled) {
                authEnabled = isEnabled;
            });

            promise.then(checker, checker);
        });

        it('Authentication is enabled on server side.', function (done) {
            var jsonResp = {
                auth_uri: ["/some/url", "/some/url1", "/some/url2"]
            };

            this.server.respondWith([401, {'Content-Type': 'application/json'}, JSON.stringify(jsonResp)]);

            var authManager = new CDAPAuth.Manager(),
                authEnabled = false,
                promise = null,
                checker = function () {
                    expect(authEnabled).to.be.ok();
                    done();
                };

            authManager.configure({username: 'username', password: 'password'});
            promise = authManager.isAuthEnabled();
            promise.then(function (isEnabled) {
                authEnabled = isEnabled;
            });

            promise.then(checker, checker);
        });

        it('"getToken" returns valid object', function (done) {
            var jsonResp = {
                "access_token": "2YotnFZFEjr1zCsicMWpAA",
                "token_type": "Bearer",
                "expires_in": 3600
            };

            this.server.respondWith('GET', /\/v2\/ping/, [401, {'Content-Type': 'application/json'}, JSON.stringify({auth_uri: ['/some/url']})]);
            this.server.respondWith('GET', /\/some\/url/, [200, {'Content-Type': 'application/json'}, JSON.stringify(jsonResp)]);

            var authManager = new CDAPAuth.Manager(),
                authToken = null,
                checker = function () {
                    expect(authToken).to.have.property('token');
                    expect(authToken).to.have.property('type');
                    done();
                };

            authManager.configure({username: 'username', password: 'password'});
            var tokenPromise = authManager.getToken();
            tokenPromise.then(function (token) {
                authToken = token;
            }).then(checker, checker);
        });

        it('"getToken" returns valid token data', function (done) {
            var jsonRespAuthUrls = {
                    auth_uri: ["/token/url", "/token/url1", "/token/url2"]
                },
                jsonRespAuthToken = {
                    access_token: "2YotnFZFEjr1zCsicMWpAA",
                    token_type: "Bearer",
                    expires_in: 3600
                };

            this.server.respondWith(/\/v2\/ping$/, [401, {'Content-Type': 'application/json'}, JSON.stringify(jsonRespAuthUrls)]);
            this.server.respondWith(/\/token\/url[1-9]*$/, [200, {'Content-Type': 'application/json'},
                JSON.stringify(jsonRespAuthToken)]);

            var authManager = new CDAPAuth.Manager(),
                authToken = null,
                checker = function () {
                    expect(authToken.token).to.be(jsonRespAuthToken.access_token);
                    expect(authToken.type).to.be(jsonRespAuthToken.token_type);
                    done();
                };

            authManager.configure({username: 'username', password: 'password'});

            var tokenPromise = authManager.getToken();
            tokenPromise.then(function (token) {
                authToken = token;
            }).then(checker, checker);
        });
    });
});