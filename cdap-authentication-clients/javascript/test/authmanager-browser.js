describe('CDAP Auth manager tests', function () {
    beforeEach(function () {
        /*        sinon.log = function (data) {
         console.log(data);
         };*/
        this.server = sinon.fakeServer.create();
    });

    afterEach(function () {
        this.server.restore();
    });

    describe('Checking Auth Manager functionality', function () {
        it('Constructor creates correct object', function () {
            var authManager = new CASKAuthManager();

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
            var authManager = new CASKAuthManager();
            expect(function () {
                authManager.configure({});
            }).to.throwException(function (e) {
                    expect(e).to.be.an(Error);
                });
        });

        it('Authentication is disabled on server side.', function () {
            this.server.respondWith([200, {'Content-Type': 'application/json'}, '']);

            var authManager = new CASKAuthManager(),
                authEnabled = false;

            authManager.configure({username: 'username', password: 'password'});
            authEnabled = authManager.isAuthEnabled();

            expect(authEnabled).to.not.be.ok();
        });

        it('Authentication is enabled on server side.', function () {
            var jsonResp = {
                auth_uri: ["/some/url", "/some/url1", "/some/url2"]
            };

            this.server.respondWith([401, {'Content-Type': 'application/json'}, JSON.stringify(jsonResp)]);

            var authManager = new CASKAuthManager(),
                authEnabled = false;

            authManager.configure({username: 'username', password: 'password'});
            authEnabled = authManager.isAuthEnabled();

            expect(authEnabled).to.be.ok();
        });

        it('"getToken" returns valid object', function () {
            var jsonResp = {
                "access_token": "2YotnFZFEjr1zCsicMWpAA",
                "token_type": "Bearer",
                "expires_in": 3600
            };

            this.server.respondWith([200, {'Content-Type': 'application/json'}, JSON.stringify(jsonResp)]);

            var authManager = new CASKAuthManager(),
                authToken = '';

            authManager.configure({username: 'username', password: 'password'});
            authToken = authManager.getToken();

            expect(authToken).to.have.property('token');
            expect(authToken).to.have.property('type');
        });

        it('"getToken" returns valid token data', function () {
            var jsonResp1 = {
                    auth_uri: ["/token/url", "/token/url1", "/token/url2"]
                },
                jsonResp2 = {
                    access_token: "2YotnFZFEjr1zCsicMWpAA",
                    token_type: "Bearer",
                    expires_in: 3600
                };

            this.server.respondWith(/\/$/, [401, {'Content-Type': 'application/json'}, JSON.stringify(jsonResp1)]);
            this.server.respondWith(/\/token\/url[1-9]*$/, [200, {'Content-Type': 'application/json'},
                JSON.stringify(jsonResp2)]);

            var authManager = new CASKAuthManager(),
                authToken;

            authManager.configure({username: 'username', password: 'password'});

            if (authManager.isAuthEnabled()) {
                authToken = authManager.getToken();
            }

            expect(authToken.token).to.be(jsonResp2.access_token);
            expect(authToken.type).to.be(jsonResp2.token_type);
        });
    });
});