'use strict';

var request = require('request');
var async = require('async');

var url = 'http://localhost:8080/';

async.series([

    function (callback) {
        request.get(url + 'getUserName?id=1234', function (err, res, body) {
            callback(null, 'Name: ' + JSON.parse(body).value);
        });
    },

    function (callback) {
        request.get(url + 'getUserStatus?id=1234', function (err, res, body) {
            callback(null, 'Status: ' + JSON.parse(body).value);
        });
    },

    function (callback) {
        request.get(url + 'getUserCountry?id=1234', function (err, res, body) {
            callback(null, 'Country: ' + JSON.parse(body).value);
        });
    },

    function (callback) {
        request.get(url + 'getUserAge?id=1234', function (err, res, body) {
            callback(null, 'Age: ' + JSON.parse(body).value);
        });
    }
],
    // In case that one of the series steps passes a non-null value to its callback as the first parameter, the
    // series is immediately stopped, and the final callback is triggered with the results that have been
    // collected to far, and the err parameter set to the error value passed by the failing step.
    function (err, results) {
        for (var i = 0; i < results.length; i++) {
            console.log(results[i]);
        }
    }
);
