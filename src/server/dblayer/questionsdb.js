var conn = require('../db');
var ObjectId = require('mongodb').ObjectID;

module.exports = {

    qall: function (req, res, next) {
        conn.get().collection('Questions').find().toArray(function (err, data) {
            if (err) {
                return next(err);
            }
            res.json(data);
        });
    },

    qByCategory: function (req, res, next) {
        var obj = req.body;
        if (obj.categoryId == "All" || obj.categoryId == undefined) {
            conn.get().collection('Questions').find().toArray(function (err, data) {
                if (err) {
                    return next(err);
                }
                res.json(data);
            });
        }
        else {
            conn.get().collection('Questions').find({ category: obj.categoryId }).toArray(function (err, data) {
                if (err) {
                    return next(err);
                }
                res.json(data);
            });
        }
    },


    qgetById: function (req, res, next) {
        var qid = req.body;

        conn.get().collection('Questions').find({ _id: ObjectId(qid.id) }).toArray(function (err, data) {
            if (err) {
                return next(err);
            }
            res.json(data);
        });
    },

    qAdd: function (req, res, next) {
        var questions = req.body;
        conn.get().collection('Questions').insert(questions, function (err, data) {
            if (err) {
                return next(err);
            }
            res.json(data);

        });
    },

    qUpdate: function (req, res, next) {
        var qustions = req.body;

        var qid = { _id: ObjectId(qustions.id) }
        var toUpdate = { answer: qustions.answer, category: qustions.category, choice: qustions.choice, questionType: qustions.questionType, text: qustions.text, uploadedFileNames: qustions.uploadedFileNames }
        conn.get().collection('Questions').update(qid, { $set: toUpdate }, function (err, result) {
            if (err) {
                return next(err);
            }

            res.send(result);

        })

    },

    qDelete: function (req, res, next) {
        var qustions = req.body;

        conn.get().collection('Questions').remove({ _id: ObjectId(qustions._id) }, function (err, result) {
            if (err) {
                return next(err);
            }

            res.json(result);

        });
    },


    getQuestions: function (req, res, next) {
        var data = req.body;

        conn.get().collection('Tests').find({ _id: ObjectId(data.testid) }).toArray(function (err, result) {
            if (err) {
                return next(err);
            }

            res.json(result);
        });
    },
    getQstAnswNames: function (req, res, next) {
        var data = req.body;

        conn.get().collection('Questions').find({ _id: ObjectId(data.qid) }).toArray(function (err, result) {
            if (err) {
                return next(err);
            }

            res.json(result);
        });
    },
    selectedAnswers: function (req, res, next) {
        var data = req.body;

        conn.get().collection('UserAnswers').find({ testid: data.tid, userid: data.userid }).toArray(function (err, result) {
            if (err) {
                return next(err);
            }

            res.json(result);
        });
    }

}