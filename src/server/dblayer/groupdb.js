var conn = require('../db');
var ObjectId = require('mongodb').ObjectID;


module.exports = {
    creategroup: function (req, res, next) {
        var group = req.body;
        conn.get().collection('Groups').insert(group, function (err, result) {
            if (err) {
                return next(err);
            }
            res.json(result);
        });
    },

    deletegroupRecord: function (req, res, next) {
        var group = req.body;
        conn.get().collection('Groups').remove({ name: group.name }, function (err, result) {
            if (err) {
                return next(err);
            }
            var data = {};
            res.json(result);

        });
    },

    editgroupRecord: function (req, res, next) {
        var group = req.body;
        var gid = { _id: ObjectId(group._id) };
        var toChange = { name: group.name };
        conn.get().collection("Groups").update(gid, { $set: toChange }, function (err, result) {
            if (err) {
                return next(err);
            }
            res.json(result);
        });
    },

    groupList: function groupList(req, res, next) {
        conn.get().collection('Groups').find().toArray(function (err, data) {
            if (err) {
                return next(err);
            }
            res.json(data);
        });
    }

}