// require request and the ORM (object relational mapping)
var request = require("request");
var orm = require("../config/orm.js");

// define soladmin, which contains functions to configure the message router and publish messages
var soladmin = {

    // configure the message router via several POST requests to the SEMP solace API
    configureMessageVpn: function (user, pass, vpn, app, api, cb) {

        // Request #1: Create the ACL profile for publishing
        orm.createAclProfile(user, pass, vpn, app, api, "pub", function (result) {

            // If request #1 returns a 200, then...
            if (result.body.meta.responseCode === 200) {

                // Request #2: Create the ACL profile for subscribing
                orm.createAclProfile(user, pass, vpn, app, api, "sub", function (result) {

                    // If request #2 returns a 200, then...
                    if (result.body.meta.responseCode === 200) {

                        // Request #3: Create the client profile for the publisher
                        orm.createClientUsername(user, pass, vpn, app, api, "pub", function (result) {

                            // If request #3 returns a 200, then...
                            if (result.body.meta.responseCode === 200) {

                                // Request #4: Create the client profile for the subscriber
                                orm.createClientUsername(user, pass, vpn, app, api, "sub", function (result) {
                                    // return the result back to the controller either way, as this is the final post request
                                    cb(result);
                                });
                            }
                            else {
                                // If not 200, return the result to the controller
                                cb(result);
                            }
                        });
                    }
                    else {
                        // If not 200, return the result to the controller
                        cb(result);
                    }
                });
            }
            else {
                // If not 200, return the result to the controller
                cb(result);
            }
        });
    }
}
module.exports = soladmin;