var conn = require('../db');
var ObjectId = require('mongodb').ObjectID;


module.exports = {
    createcategory: function (req, res, next) {
        var category = req.body;
        conn.get().collection('Categories').insert(category, function (err, result) {
            if (err) {
                return next(err);
            }
            var data = {};
            res.json(result);
        });
    },

    deletecategoryRecord: function (req, res, next) {
        var category = req.body;
        conn.get().collection('Categories').remove({ name: category.name }, function (err, data) {
            if (err) {
                return next(err);
            }
            res.json(data);
        });
    },

    deleteCategoryWiseQuestions: function (req, res, next) {
        var category = req.body;
        conn.get().collection('Questions').remove({ category: category }, function (err, data) {
            if (err) {
                return next(err);
            }
            res.json(data);
        });
    },

    editcategoryRecord: function (req, res, next) {
        var category = req.body;
        var catId = { _id: ObjectId(category.id) };
        var newname = { name: category.name };
        conn.get().collection("Categories").update(catId, { $set: newname }, function (err, result) {
            if (err) {
                return next(err);
            }
            res.json(result);
        });
    },

    categoryList: function (req, res, next) {
        conn.get().collection('Categories').find().toArray(function (err, data) {
            if (err) {
                return next(err);
            }
            res.json(data);
        });
    }
}