var MongoClient = require('mongodb').MongoClient

var state = {
  db: null,
}



var async = require('async');
var express = require('express');


var app = express();
var conn = {};


module.exports = {
  connect: function(url, dbName, done) {
    if (state.db) return done();

    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
      if (err) return done(err);
      state.db = client.db(dbName);
      done();
    });
  },
  
  get: function() {
    return state.db;
  },
  
  close: function(done) {
    if (state.db) {
      state.db.client().close(function(err, result) {
        state.db = null;
        done(err);
      });
    }
  }
};