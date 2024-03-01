var conn = require('../db');
var ObjectId = require('mongodb').ObjectID;

module.exports = {
    insertInstructions: function (req, res, next) {
        var data = req.body;
        var text = data.text;
        conn.get().collection('QuizInstructions').insert(data, function (err, result) {
            if (err) {
                return next(err);
            }
            res.json(result);
        });
    },

    getInstructions: function (req, res, next) {
        conn.get().collection('QuizInstructions').find().toArray(function (err, result) {
            if (err) {
                return next(err);
            }
            res.json(result);
        });
    },

    removeInstructions: function (req, res, next) {
        var data = req.body;
        conn.get().collection('QuizInstructions').remove({ _id: ObjectId(data._id) }, function (err, result) {
            if (err) {
                return next(err);
            }
            res.json(result);
        });
    }
}
