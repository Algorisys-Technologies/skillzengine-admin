var conn = require('../db');
var ObjectId = require('mongodb').ObjectID;

module.exports = {

    getActiveTest: function (req, res, next) {
        var usrname = req.body;
        conn.get().collection('Tests').find({ IsActive: true }).toArray(function (err, data) {
            if (err) {
                return next(err);
            }

            res.json(data);

        });
    },

    testByGroup: function (req, res, next) {
        var obj = req.body;

        if (obj.groupid == "All" || obj.groupid == undefined) {
            conn.get().collection('Tests').find().toArray(function (err, data) {
                if (err) {
                    return next(err);
                }
                res.json(data);

            });
        }
        else {
            conn.get().collection('Tests').find({ groupid: obj.groupid }).toArray(function (err, data) {
                if (err) {
                    return next(err);
                }
                res.json(data);

            });
        }
    },

    updateTestStatusAll: function (req, res, next) {

        var toChange = { IsActive: true }
        var newValue = { IsActive: false }
        conn.get().collection("Tests").updateMany(toChange, { $set: newValue }, function (err, result) {
            if (err) {
                return next(err);
            }
            res.json(result);

        });
    },

    updateTestStatusById: function (req, res, next) {
        var obj = req.body;
        var toChange = { _id: ObjectId(obj.id) };
        var newValue = { IsActive: true };

        conn.get().collection("Tests").update(toChange, { $set: newValue }, function (err, result) {
            if (err) {
                return next(err);
            }
            var data = {};
            res.json(data);

        });
    },

    updateIscalTest: function (req, res, next) {
        var obj = req.body;

        var toUpdate = { _id: ObjectId(obj.id) };
        var newValue = { iscalculated: false };

        conn.get().collection('Tests').update(toUpdate, { $set: newValue }, function (err, result) {
            if (err) {
                return next(err);
            }

            res.json(result);
        })

    },


    getMyTests: function (req, res, next) {
        var user = req.body;
        conn.get().collection('UserTests').find({ userId: user.userId, issubmit: false }).toArray(function (err, data) {
            if (err) {
                return next(err);
            }
            res.json(data);

        });
    },

    getUserTests: function (req, res, next) {
        var user = req.body;

        conn.get().collection('UserTests').find({ userId: user.userId }).toArray(function (err, data) {
            if (err) {
                return next(err);
            }

            res.json(data);


        });

    },

    getallUserTests: function (req, res, next) {
        conn.get().collection('UserTests').find().toArray(function (err, data) {
            if (err) {
                return next(err);
            }
            res.json(data);


        });

    },


    all: function (req, res, next) {
        conn.get().collection('Tests').find().toArray(function (err, data) {
            if (err) {
                return next(err);
            }
            res.json(data);

        });
    },

    add: function (req, res, next) {
        var tests = req.body;
        conn.get().collection('Tests').insert(tests, function (err, result) {
            if (err) {
                return next(err);
            }
            var data = {};
            res.json(data);

        });
    },

    getByTestId: function (req, res, next) {
        var testid = req.body;

        conn.get().collection('Tests').find({ _id: ObjectId(testid.testId) }).toArray(function (err, data) {

            if (err) {
                return next(err);
            }
            res.json(data);


        });
    },

    updatemarks: function (req, res, next) {
        var obj = req.body;

        var toChange = { _id: ObjectId(obj.id) }
        var newValue = { iscalculated: obj.iscalculated }

        conn.get().collection("Tests").update(toChange, { $set: newValue }, function (err, data) {
            if (err) {
                return next(err);
            }
            var data = {};
            res.json(data);

        });


    },

    rAll: function (req, res, next) {
        conn.get().collection('Tests').find().toArray(function (err, data) {
            if (err) {
                return next(err);
            }

            res.json(data);


        });
    },

    deleteTest: function (req, res, next) {
        var del = req.body;

        conn.get().collection("UserTests").find({ testName: del.testName }).toArray(function (err, result) {
            if (err) {
                return next(err);
            }


            if (result.length > 0) {
                res.json("Test assigned to user");
            }
            else {
                conn.get().collection("Tests").remove({ testName: del.testName }, function (err, data) {
                    if (err) {
                        return next(err);
                    }

                    res.json(data);

                });
            }
        });


    },

    updateTest: function (req, res, next) {
        var obj = req.body;
        var toChange = { _id: ObjectId(obj.id) }
        var newValues = { qIds: obj.qIds, testName: obj.testName, testTime: obj.testTime, isAutoCalc: obj.isAutoCalc, groupid: obj.groupid, category: obj.category, isShowTest: obj.isShowTest, isShowResult: obj.isShowResult, isShowScreen: obj.isShowScreen, isShowVideo: obj.isShowVideo  }
        conn.get().collection("Tests").update(toChange, { $set: newValues }, function (err, data) {
            if (err) {
                return next(err);
            }

            res.json(data);

        });
    },

    getTestWiseMarks: function (req, res, next) {
        var testid = req.body;

        conn.get().collection('UserTests').find({ testId: testid.testId, issubmit: true }).toArray(function (err, result) {
            if (err) {
                return next(err);
            }

            res.json(result);
        })
    },

    getUserWiseMarks: function (req, res, next) {
        var data = req.body;
        conn.get().collection('UserTests').find({ testId: data.testId, userId: data.userId }).toArray(function (err, result) {
            if (err) {
                return next(err);
            }

            res.json(result);
        })
    },

    getQuestionsAndAnswers: function (req, res, next) {
        var data = req.body;
        var questionsArray = [];
        var answersArray = [];
        conn.get().collection('Tests').find({ _id: ObjectId(data.testId) }).toArray(function (err, result) {
            if (err) {
                return next(err);
            }
            if (result && result.length === 0) {
                res.json(result);
            } else {

                var qids = result[0].qIds;
                var arr = qids.map(x => ObjectId(x));
                conn.get().collection('Questions').find({ _id: { $in: arr } }).toArray(function (err, result1) {
                    if (err) {
                        return next(err);
                    }
                    questionsArray = result1;


                    conn.get().collection('UserAnswers').find({ testid: data.testId, userid: data.userId }).toArray(function (err, uanswers) {
                        if (err) {
                            return next(err);
                        }

                        for (var i = 0; i < questionsArray.length; i++) {
                            for (j = 0; j < uanswers.length; j++) {
                                if (questionsArray[i]._id == uanswers[j].questionid) {
                                    questionsArray[i].selectedanswer = uanswers[j].selection;
                                    questionsArray[i].selectedanswerid = uanswers[j]._id;
                                    questionsArray[i].iscorrect = uanswers[j].iscorrect;
                                    questionsArray[i].mark = uanswers[j].mark;
                                    questionsArray[i].userid = uanswers[j].userid;
                                    questionsArray[i].testid = uanswers[j].testid;

                                }
                            }
                        }
                        res.json(questionsArray);
                    })
                })
            }


        })
    },

    updateTextAnswers: function (req, res, next) {

        var data = req.body.answersArray;

        for (var i = 0; i < data.length; i++) {

            var tochange = { _id: ObjectId(data[i].selectedanswerid) };
            var userans = { iscorrect: data[i].iscorrect, mark: data[i].mark };

            conn.get().collection("UserAnswers").update(tochange, { $set: userans }, function (err, result) {
                if (err) {
                    return next(err);
                }

            });
        }

        conn.get().collection("Tests").find({ _id: ObjectId(data[0].testid) }).toArray(function (err, testsdata) {
            if (err) {
                return next(err);
            }

            var qlength = testsdata[0].qIds.length;

            conn.get().collection("UserAnswers").find({ userid: data[0].userid, testid: data[0].testid }).toArray(function (err, result1) {
                if (err) {
                    return next(err);
                }

                var marks = 0
                for (var i = 0; i < result1.length; i++) {
                    marks += result1[i].mark;
                }
                var percentage = ((marks / qlength) * 100).toFixed(2);

                toChange = { testId: data[0].testid, userId: data[0].userid }
                toUpdateMarks = { Marks: percentage }

                conn.get().collection("UserTests").update(toChange, { $set: toUpdateMarks }, function (err, updated) {

                    if (err) {
                        return next(err);
                    }
                })
            })

        })
        res.json("updated sucessfully");
    },

    getTodaysGivenTests: function (req, res, next) {
        var data = [];

        conn.get().collection("UserTests").find({ issubmit: true }).toArray(function (err, result) {
            if (err) {
                return next(err);
            }
            res.json(result);

        });
    },

    getUserTestsAndTests: function (req, res, next) {
        var user = req.body;

        conn.get().collection('UserTests').aggregate([
            { $match: { userId: user.userId } },
            {
                $lookup: {
                    from: "Tests",
                    localField: "_id.Str",
                    foreignField: "testId",
                    as: "getUserNTestsData"
                }
            }

        ]).toArray(function (err, data) {
            if (err) {
                return next(err);
            }
            res.json(data);
        });
    }
}