var conn = require('../db');
var nodemailer = require('nodemailer');
var ObjectId = require('mongodb').ObjectID;
var crypto = require('crypto');
var config = require('../Config/configuration');
var { sendEmail } = require('./mailer');

var dbConnection = null;


var self = module.exports = {
    checkEmail: function (req, res, next) {
        var obj = req.body;
        var date = new Date();
        var newtime = new Date(date.setSeconds(date.getSeconds() + 1800));
        var newTime = newtime.toString();
        conn.get().collection('users').find({ name: obj.email }).toArray(function (err, result) {
            if (err) {
                return next(err);
            }
            if (result.length == 0) {
                res.json("Change password link sent on your email");
            }
            else {
                self.forgotPasswordMail(result[0], newTime, obj.urlFrom)
                res.json("Change password link sent on your email");
            }
        })
    },

    forgotPasswordMail: function (data, newTime, urlfrom) {
        var userGrp = data.group;
        var configUrls ='';
        if(userGrp == 'user' || userGrp == 'User')
        {
            configUrls = config.clientUrl;
        }
        else  if (userGrp == 'admin' || userGrp == 'Admin')
        {
            configUrls = config.adminUrl;
        }
        var message = {
            to: data.name,
            from: config.from,
            subject: "Reset password",
            html: "Hello,<br> Please Click on the link to change your password.<br><a href='" + configUrls + "/resetpass?id=" + data._id + "&time=" + newTime + "'>Reset Password</a>"
                        
        };
        sendEmail(message, function (error) {
            if (error) {
                return;
            }
        });


    },

    resetPass: function (req, res, next) {
        var obj = req.body;
        saltHashPassword(obj.new)
        function saltHashPassword(pass1) {
            var salt = config.salt;
            var passwordNew = self.sha512(pass1, salt);
            var password = passwordNew.passwordHash;

            conn.get().collection('users').find({ _id: ObjectId(obj.id) }).toArray(function (err, data) {
                if (err) {
                    return next(err);
                }

                if (data.length > 0) {
                    var tochange = { _id: ObjectId(obj.id) };
                    var newvalue = { password: password }
                    conn.get().collection('users').update(tochange, { $set: newvalue }, function (err, result) {
                        if (err) {

                            return next(err);
                        }
                        res.json("Password reset successfully");
                    })
                }
            })
        }
    },

    loginDetails: function (req, res, next) {
        var dd = new Date();
        var uname = req.body;
        conn.get().collection('loginDetails').insert({ name: uname, loginDate: dd }, function (err, result) {
            if (err) {
                return next(err);
            }

            res.json(result);

        });

    },

    genRandomString: function (length) {
        return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
    },

    sha512: function (password, salt) {
        var hash = crypto.createHmac('sha512', salt);
        hash.update(password);
        var value = hash.digest('hex');
        return {
            salt: salt,
            passwordHash: value
        };
    },


    createUser: function (req, res, next) {
        var userId = "";
        var user = req.body;
        console.log('user', user);
        var pass = user.password;
        var date = new Date();
        var toupdate = { name: user.name };
        var newValue = { Time: new Date() };
        saltHashPassword(pass);

        function saltHashPassword(pass) {

            var salt = config.salt;
            var passwordData = self.sha512(pass, salt);
            user.password = passwordData.passwordHash;

            conn.get().collection('users').insert(user, function (err, data) {
                if (err) {
                    return next(err);
                }

                var user = req.body.name;

                conn.get().collection('users').find({ name: user }).toArray(function (err, data) {
                    if (err) {
                        return next(err);
                    }
                    userId = data[0]._id;
                    userName = data[0].name;
                    userTime = newValue.Time;
                    timeString = userTime.toString();
                    var abc = "sending email";
                    conn.get().collection('Logs').insert({ content: abc }, function (err, data) {

                    })

                    self.sendmail(req, userId, timeString, userName);

                });
                var data = {};
                res.json(data);

            });
        }

        conn.get().collection('users').update(toupdate, { $set: newValue }, function (err, result) {
            if (err) {
                return next(err);
            }
        });


    },
    createMultipleUser: function (req, res, next) {
        var userId = "";
        var user = req.body;
        var emails = user.name;
        console.log('user', user);
        var pass = user.password;
        var date = new Date();
        var toupdate = { name: user.name };
        var newValue = { Time: new Date() };
        var salt = config.salt;
        var passwordData = self.sha512(pass, salt);
        var emailList = emails.split(';');
        var multipleusers = [];
        var bulkInsertSuccess = false;
        var newtime = new Date(date.setSeconds(date.getSeconds() + 1800));
        var newTime = newtime.toString();
        for (let i = 0; i < emailList.length; i++) {
            let newUser = {};
            newUser.name = emailList[i];
            newUser.password = passwordData.passwordHash;
            newUser.group = 'User';
            newUser.isActive = true;
            newUser.Time = newValue.Time;
            multipleusers.push(newUser);
        }
        conn.get().collection('users').insert(multipleusers, function (err, data) {
            if (err) {
                return next(err);
            }
            conn.get().collection('users').find({ name: { $in: emailList } }).toArray(function (err, result) {
                if (err) {
                    return next(err);
                }
                for (const key of Object.keys(result)) {
                    self.forgotPasswordMail(result[key], newTime)
                }

            });
            var data = {};
            res.json(data);
        });
    },

    updateStatus: function (req, res, next) {

        var usrId = req.body;

        var tochange = { _id: ObjectId(usrId.uid) };
        var newValue = { isActive: usrId.status };

        conn.get().collection('users').update(tochange, { $set: newValue }, function (err, result) {
            if (err) {
                return next(err);
            }
            res.json(result);
        });




    },

    updateUser: function (req, res, next) {
        var user = req.body;
        saltHashPassword(user.oldpassword, user.newpassword)

        function saltHashPassword(pass1, pass2) {

            var salt = config.salt;
            var oldPassword = self.sha512(pass1, salt);
            var newPassword = self.sha512(pass2, salt);
            var password1 = oldPassword.passwordHash;
            var password2 = newPassword.passwordHash;
            conn.get().collection('users').find({ name: user.name }).toArray(function (err, data) {
                if (err) {
                    return next(err);
                }

                if (data[0].password == password1 && user.isActive == true) {

                    var un = { name: user.name };
                    conn.get().collection('users').update(un, { $set: { password: password2 } }, function (err, result) {
                        if (err) {
                            return next(err);
                        }

                        var data = { "state": true, "message": "Password Updated Successfully" };
                        res.json(data);
                    });
                } else {
                    var data = { "state": false, "message": "Old password is incorrect" };
                    res.json(data);
                }
            });
        }
    },

    // MongoDb
    deleteUserRecord: function (req, res, next) {
        var user = req.body;
        conn.get().collection('users').remove({ name: user.name }, function (err, data) {
            if (err) {
                return next(err);
            }
            var data = {};
            res.json(data);
        });
    },

    deleteUserByName: function (req, res, next) {
        var user = req.body;
        conn.get().collection('users').remove({ name: user.name }, function (err, data) {
            if (err) {
                return next(err);
            }
            var data = {};
            res.json(data);
        });
    },

    editUserRecord: function (req, res, next) {
        var user = req.body;
        var uid = { _id: ObjectId(user.id) };
        var newvalues = { name: user.name, password: user.password, group: user.group, isActive: user.isActive };

        conn.get().collection('users').update(uid, { $set: newvalues }, function (err, result) {
            if (err) {
                res.next(err);
            }
            res.json(result);
        });
    },

    userList: function (req, res, next) {
        conn.get().collection('users').find().toArray(function (err, data) {
            if (err) {
                return next(err);
            }
            delete data[0]['password'];
            res.json(data);

        });
    },
    allAnswers: function (req, res, next) {
        conn.get().collection('UserAnswers').find().toArray(function (err, data) {
            if (err) {
                return next(err);
            }
            res.json(data);

        });
    },
    getAllUsers: function (req, res, next) {
        conn.get().collection('users').find().toArray(function (err, result) {
            if (err) {
                return next(err);
            }
            res.json(result);

        });
    },

    getByUsersName: function (req, res, next) {
        var usrname = req.body;
        var p = "^" + usrname.name + "$"
        conn.get().collection('users').find({ name: { $regex: p, $options: "i" } }).toArray(function (err, data) {
            if (err) {
                return next(err);
            }
            res.json(data);

        });
    },
    getByMultipleUsersName: function (req, res, next) {
        var emailList = Object.values(req.body.name);
        conn.get().collection('users').find({ name: { $in: emailList } }).toArray(function (err, data) {
            if (err) {
                return next(err);
            }
            res.json(data);

        });
    },

    allusertest: function (req, res, next) {
        conn.get().collection('UserTests').find().toArray(function (err, data) {
            if (err) {
                return next(err);
            }
            res.json(data);

        });
    },

    updateUserRetest: function (req, res, next) {
        var obj = req.body;
        var tochange = { testId: obj.testid, userId: obj.userid }
        var newValue = { isRetest: true, isStarted: false }
        conn.get().collection("UserTests").update(tochange, { $set: newValue }, function (err, result) {
            if (err) {
                return next(err);
            }
            res.json(result);
        });
    },

    getSelectedUsersforTest: function (req, res, next) {
        var testid = req.body;
        conn.get().collection('UserTests').find({ testId: testid.testId }).toArray(function (err, data) {
            if (err) {
                return next(err);
            }
            res.json(data);
        });
    },



    getAllAnsGetByTestId: function (req, res, next) {
        var obj = req.body;
        conn.get().collection('UserAnswers').find({ testid: obj.testid }).toArray(function (err, data) {
            if (err) {
                return next(err);
            }
            res.json(data);
        });
    },

    assignTests: function (req, res, next) {
        var par = req.body;
        var userTests = par.userTests;

        conn.get().collection('UserTests').insert(userTests, function (err, result) {
            if (err) {
                return next(err);
            }
            var data = {};
            res.json(result);

        });


    },

    updateUserTimer: function (req, res, next) {
        var obj = req.body;

        var tochange = { testId: obj.testid, userId: obj.userid }
        var newValue = { timeTaken: parseInt(obj.timer), isStarted: true }
        conn.get().collection("UserTests").update(tochange, { $set: newValue }, function (err, result) {
            if (err) {
                return next(err);
            }
            res.json(result);
        });
    },

    getUserTimer: function (req, res, next) {
        var obj = req.body;
        conn.get().collection("UserTests").update({ testId: obj.testid, userId: obj.userid }, { $set: { isStarted: true, isRetest: false, requestRetest: false } }, function (err, result) {
            if (err) {
                return next(err);
            }
            conn.get().collection('UserTests').find({ testId: obj.testid, userId: obj.userid }).toArray(function (err, data) {
                if (err) {
                    return next(err);
                }
                res.json(data);
            });
        });

    },

    requestRetest: function (req, res, next) {
        var obj = req.body;
        var tochange = { testId: obj.testId, userId: obj.userId };
        var newValue = { requestRetest: true, retestReason: obj.retestReason };
        conn.get().collection("UserTests").update(tochange, { $set: newValue }, function (err, result) {
            if (err) {
                return next(err);
            }
            res.json(result);
        });
    },

    getRetestNotifications: function (req, res, next) {
        conn.get().collection("UserRequests").find({ allowRetest: false }).toArray(function (err, result) {
            if (err) {
                return next(err);
            }
            res.json(result);
        });
    },

    updateRetestNotifications: function (req, res, next) {
        var tochange = { testid: req.body.testid, userid: req.body.userid }
        var newValue = { allowRetest: true }
        conn.get().collection("UserRequests").updateMany(tochange, { $set: newValue }, function (err, result) {
            if (err) {
                return next(err);
            }

            var toChange = { testId: req.body.testid, userId: req.body.userid };
            var newvalue = { isRetest: true, isStarted: false };
            conn.get().collection("UserTests").update(toChange, { $set: newvalue }, function (err, res) {
                if (err) {
                    return next(err);
                }
            });

            res.json(result);
        });
    },

    insertRetestNotifications: function (req, res, next) {
        var userRequest = {};
        userRequest.userid = req.body.userid;
        userRequest.testid = req.body.testid;
        userRequest.reason = req.body.reason;
        userRequest.requestDate = new Date();
        userRequest.allowRetest = false;
        conn.get().collection('UserTests').find({ userId: userRequest.userid, testId: userRequest.testid }).toArray(function (err, result) {
            if (err) {
                return next(err);
            }
            userRequest.userName = result[0].userName;
            userRequest.testName = result[0].testName;
            userRequest.testDate = result[0].issubmitdate;

            conn.get().collection('UserRequests').insert(userRequest, function (err, result) {
                if (err) {
                    return next(err);
                }
                res.json(result);
            });
        })

    },

    findById: function (req, res, next) {
        var obj = req.body;

        conn.get().collection('UserAnswers').find(obj).toArray(function (err, data) {
            if (err) {
                var data = [];
                return res.json(data);
            }
            res.json(data);
        });
    },


    findtestbyIds: function (req, res, next) {
        var obj = req.body;

        conn.get().collection('UserAnswers').find(obj).toArray(function (err, data) {
            if (err) {
                var data = [];
                return res.json(data);
            }
            res.json(data);
        });
    },


    insert: function (req, res, next) {
        var ans = req.body;
        conn.get().collection('UserAnswers').insert(ans, function (err, data) {
            if (err) {
                return next(err);
            }
            var data = {};
            res.json(data);

        });
    },
    update: function (req, res, next) {
        var ans = req.body;
        var tochange = { _id: ObjectId(ans.id) }
        var newValue = { selection: ans.selection, isanswered: ans.isanswered }

        conn.get().collection("UserAnswers").update(tochange, { $set: newValue }, function (err, result) {
            if (err) {
                return next(err);
            }
            res.json(result);

        });
    },


    getBytestIduserid: function (req, res, next) {
        var obj = req.body;
        conn.get().collection('UserAnswers').find(obj).toArray(function (err, data) {
            if (err) {
                return next(err);
            }
            res.json(data);
        });
    },

    updateUserAnswers: function (req, res, next) {
        var ans = req.body;
        var tochange = { _id: ObjectId(ans.id) }
        var newvalue = { issubmit: ans.issubmit }
        conn.get().collection("UserAnswers").update(tochange, { $set: newvalue }, function (err, result) {
            if (err) {
                return next(err);
            }
            res.json(result);

        });
    },
    updateUserTests: function (req, res, next) {
        var obj = req.body;
        var toUpdate = { _id: ObjectId(obj.id) }
        var newValue = { issubmit: obj.issubmit, issubmitdate: new Date() }

        console.log('newValue-------', newValue)
        conn.get().collection("UserTests").update(toUpdate, { $set: newValue }, function (err, result) {
            if (err) {
                console.log('errror----------', err)
                return next(err);
            }
            console.log('result----------', result)
            res.json(result);

        });
    },

    updateAnswer: function (req, res, next) {
        var ans = req.body;
        var tochange = { _id: ObjectId(ans.id) }
        var newValue = { iscorrect: ans.iscorrect, mark: ans.mark }

        conn.get().collection("UserAnswers").update(tochange, { $set: newValue }, function (err, result) {
            if (err) {
                return next(err);
            }
            res.json(result);

        });
    },

    updateAllAnswer: function (req, res, next) {
        var ans = req.body;
        var tochange = { _id: ObjectId(ans.id) }
        var newValue = { isanswered: true }

        conn.get().collection("UserAnswers").update(tochange, { $set: newValue }, function (err, result) {
            if (err) {
                return next(err);
            }
            res.json(result);

        });
    },

    allUserAnswers: function (req, res, next) {
        conn.get().collection('UserAnswers').find().toArray(function (err, data) {
            if (err) {
                return next(err);
            }
            res.json(data);
        });
    },

    allUsers: function (req, res, next) {
        conn.get().collection('users').find().toArray(function (err, data) {
            if (err) {
                return next(err);
            }
            delete data[0]['password'];
            res.json(data);

        });
    },

    deleteUserTests: function (req, res, next) {
        var del = req.body;
        conn.get().collection('UserTests').remove({ _id: ObjectId(del.id) }, function (err, result) {
            if (err) {
                return next(err)
            }
            res.json(result);
        });
    },

    deleteUserTestsAnswers: function (req, res, next) {
        var del = req.body;
        conn.get().collection('UserAnswers').remove(del, function (err, result) {
            if (err) {
                return next(err)
            }
            res.json(result);
        });
    },

    deleteUserAnswer: function (req, res, next) {
        var del = req.body;
        conn.get().collection('UserAnswers').remove(del, function (err, result) {
            if (err) {
                return next(err)
            }
            res.json(result);
        });
    },

    resultShow: function (req, res, next) {
        var data = req.body;

        conn.get().collection('UserTests').find().toArray(function (err, result) {
            res.json(result);
        })
    },

    getTestWiseResults: function (req, res, next) {
        var data = req.body;

        conn.get().collection('UserAnswers').find({ testid: data.testId }).toArray(function (err, result) {
            if (err) {
                return next(err);
            }
            res.json(result);
        })
    },



    updateTestMarks: function (req, res, next) {
        var data = req.body;
        var tochange = { userId: data.userid, testId: data.testid }
        var newValue = { Marks: data.marks }

        conn.get().collection('UserTests').update(tochange, { $set: newValue }, function (err, result) {
            if (err) {
                return next(err);
            }
            res.json(result);
        })
    },

    updateAnswerModel: function (req, res, next) {
        var data = req.body;
        var tochange = { userid: data.userid, questionid: data.quesid, testid: data.testid };
        var newValue = { selection: data.answ }

        conn.get().collection('UserAnswers').update(tochange, { $set: newValue }, function (err, result) {
            if (err) {
                return next(err);
            }
            res.json(result);
        });


    },

    getSubmitMarks: function (req, res, next) {
        var user = req.body;
        conn.get().collection('UserTests').find({ userId: user.userid, issubmit: true }).toArray(function (err, data) {
            if (err) {
                return next(err);
            }
            res.json(data);
        })
    },

    userTestResult: function (req, res, next) {
        var data = req.body;
        conn.get().collection('UserTests').find({ userId: data.userid, testId: data.testid }).toArray(function (err, result) {
            if (err) {
                return next(err);
            }
            res.json(result);
        })

    },

    loginUser: function (req, res, next) {

        var user = req.body;

        conn.get().collection("users").find({ _id: ObjectId(user.id) }).toArray(function (err, data) {
            if (err) {
                return next(err);
            }
            res.json(data);
        });
    },

    verifyMail: function (req, res, next) {

        var user = req.query;

        var time = new Date(user.time);

        if (new Date(time.setSeconds(time.getSeconds() + 120000)) >= new Date()) {
            var nd = { "name": user.name };

            var toUpdate = { "isActive": true };

            conn.get().collection('users').update(nd, { $set: toUpdate }, function (err, result) {
                if (err) {
                    return next(err);
                    res.write("<p>Your email not verified!</p>");
                    res.end();
                }
                else {
                    res.write("<p>Your email has been verified!</p>");
                    res.end();
                }
            });
        }
        else {
            conn.get().collection('users').remove({ "isActive": false }, function (err, data) {
                if (err) {
                    return next(err);
                }
                res.write("<p>Your link has been expired!</p>");
                res.end();

            });

        }

    },

    sendmail: function (req, userId, timeString, userName) {
        var def = "in sendmail";
        var userGrp = req.body.group;
        var configUrls ='';

        if(userGrp == 'user' || userGrp == 'User')
        {
            configUrls = config.clientUrl;
        }
        else  if (userGrp == 'admin' || userGrp == 'Admin')
        {
            configUrls = config.adminUrl;
        }

        conn.get().collection('Logs').insert({ log: def }, function (err, data) {

        });

        var message = {
            to: req.body.name,
            from: config.from,
            subject: "Activation",
            html: "Hello,<br> Please Click on the link to verify your email.<br><a href='" + configUrls + "'/routes/VerifyMail?id=" + userId + "&time=" + timeString + "&name=" + userName + "'>Verify</a>"
        };

        conn.get().collection('Logs').insert({ mess: message }, function (err, data) {

        });
        sendEmail(message, function (error) {
            if (error) {
                return;
            }
        });
    },

    assignedTestMail: function (req, res, next) {

        var datasend = JSON.stringify(req.body.uid);
        var obj = {};

        conn.get().collection('users').find({ _id: ObjectId(req.body.uid) }).toArray(function (err, result) {
            if (err) {
                return next();
            }
            var message = {
                to: (JSON.stringify(result[0].name)),
                from: config.from,
                subject: "Assigning the test",
                html: "Hello,<br>" + req.body.tname + " Test is assigned to you<br>"
            };
            sendEmail(message, function (error) {
                if (error) {
                    return;
                }
                res.send("Message sent successfully");
            });
        });

    },

    // Ass

    getMarksCalculateMessage: function (req, res, next) {
        var data = req.body;
        var userTestsData = [];
        var questionsLength = 0;
        var uid = '';

        conn.get().collection("Tests").find({ _id: ObjectId(data.testid) }).toArray(function (err, tests) {
            if (err) {
                return next(err);
            }
            questionsLength = tests[0].qIds.length;


            conn.get().collection("UserTests").find({ testId: data.testid }).toArray(function (err, result) {
                if (err) {
                    return next(err);
                }
                userTestsData = result;

                conn.get().collection("UserAnswers").find({ testid: data.testid }).toArray(function (err, data1) {
                    if (err) {
                        return next(err);
                    }
                    for (var i = 0; i < userTestsData.length; i++) {
                        var mks = 0
                        for (var j = 0; j < data1.length; j++) {

                            if (userTestsData[i].userId === data1[j].userid) {
                                uid = data1[j].userid;
                                mks += data1[j].mark;
                            }
                        }
                        var grade = ((mks / questionsLength) * 100).toFixed(2);
                        var tochange = { testId: data.testid, userId: uid }
                        var percentage = { Marks: grade };
                        conn.get().collection("UserTests").update(tochange, { $set: percentage }, function (err, result) {
                            if (err) {
                                return next(err);
                            }
                        })
                    }

                })
                res.send("Marks calculated");
            })
        })
    },


    updateTextans: function (req, res, next) {
        var aid = req.body;
        var tochange = { _id: ObjectId(aid.useransid) };
        var userans = { iscorrect: aid.uanswer, mark: aid.mark };

        conn.get().collection("UserAnswers").update(tochange, { $set: userans }, function (err, result) {
            if (err) {
                return next(err);
            }
            res.json(result);
        });


    },

    onSubmit: function (req, res, next) {
        var obj = req.body;
        var questions = [];
        var answers = [];
        var qLength = 0;
        conn.get().collection('Tests').find({ _id: ObjectId(obj.testid) }).toArray(function (err, result) {
            if (err) {
                console.log("collection('Tests').find", err)
                return next(err);
            }

            qLength = result[0].qIds.length;

            conn.get().collection('Questions').find().toArray(function (err, result) {
                if (err) {
                    console.log("ccollection('Questions').find", err)
                    return next(err);
                }
                questions = result;

                conn.get().collection('UserAnswers').find().toArray(function (err, data) {
                    if (err) {
                        console.log("ccollection('UserAnswers').find", err)
                        return next(err);
                    }

                    answers = data;
                    self.calculateTestResults(obj.testid, obj.userid, questions, answers, qLength, res)
                    console.log('onsubmit');
                    res.send({ msg: "marks calculated" });
                });
            });
        });

    },

    calculateTestResults(testId, userid, allQuestions, allAnswers, questionsLength, res) {
        var correctans = [];
        var questAns = [];
        var userAns = [];
        var cmplen = 0;
        var arrtest = [];

        for (var i = 0; i < allAnswers.length; i++) {
            if (allAnswers[i].testid == testId && allAnswers[i].userid == userid) {
                for (var j = 0; j < allQuestions.length; j++) {

                    if (allQuestions[j]._id == allAnswers[i].questionid) {

                        if (allAnswers[i].questionType == 'mcq') {
                            cmplen = 0;

                            questAns = allQuestions[j].answer.split(',');
                            if(questAns.length>1){
                                questAns = questAns.join();
                                questAns = [questAns];
                              }
                            userAns = allAnswers[i].selection.slice();
                            for (var o = 0; o < questAns.length; o++) {
                                for (var n = 0; n < userAns.length; n++) {
                                    if (questAns[o].toLowerCase() == userAns[n].toLowerCase()) {
                                        cmplen = cmplen + 1;
                                    }
                                }
                            }

                            if (cmplen > 0 && cmplen == questAns.length && questAns.length == questAns.length) {
                                //mks++;
                                correctans.push({ questionid: allAnswers[i].questionid, userid: allAnswers[i].userid, iscorrect: true, id: allAnswers[i]._id, testid: allAnswers[i].testid, mark: 1 })
                            }
                        }
                        else if (allAnswers[i].questionType == 'boolean') {
                                var isBooleanAnswer ='';
                                if(allAnswers[i].selection.toLowerCase() =='option1')
                                {
                                    isBooleanAnswer ='True';
                                }
                                else if (allAnswers[i].selection.toLowerCase() =='option2')
                                {
                                    isBooleanAnswer ='False';
                                }
                            if (allQuestions[j].answer.toLowerCase() == isBooleanAnswer.toLowerCase()) {

                            // if (allQuestions[j].answer.toLowerCase() == allAnswers[i].selection.toLowerCase()) {
                                // mks++;
                                correctans.push({ questionid: allAnswers[i].questionid, userid: allAnswers[i].userid, iscorrect: true, id: allAnswers[i]._id, testid: allAnswers[i].testid, mark: 1 })
                            }
                        }
                        else if (allAnswers[i].questionType == 'numeric') {

                            if (allQuestions[j].answer == allAnswers[i].selection) {
                                // mks++;
                                correctans.push({ questionid: allAnswers[i].questionid, userid: allAnswers[i].userid, iscorrect: true, id: allAnswers[i]._id, testid: allAnswers[i].testid, mark: 1 })
                            }

                        }
                        else if (allAnswers[i].questionType == 'text') {

                            if (allQuestions[j].answer == allAnswers[i].selection) {
                                // mks++;
                                correctans.push({ questionid: allAnswers[i].questionid, userid: allAnswers[i].userid, iscorrect: true, id: allAnswers[i]._id, testid: allAnswers[i].testid, mark: 1 })
                            }

                        }

                    }


                }

            }

        }

        for (var k = 0; k < correctans.length; k++) {
            var tochange = { _id: correctans[k].id };
            var newValue = { iscorrect: correctans[k].iscorrect, mark: correctans[k].mark }

            conn.get().collection("UserAnswers").update(tochange, { $set: newValue }, function (err, result1) {
                if (err) {
                    console.log("collection('UserAnswers').update----1", err)
                    return next(err);
                }
            });

        }

        for (var i = 0; i < allAnswers.length; i++) {
            if (allAnswers[i].testid == testId && allAnswers[i].userid == userid) {

                var tochange = { _id: ObjectId(allAnswers[i]._id) }
                var newValue = { isanswered: true }
                conn.get().collection('UserAnswers').update(tochange, { $set: newValue }, function (err, ansUpdate) {
                    if (err) {
                        console.log("collection('UserAnswers').update---2", err)
                        return next(err);
                    }
                })

            }
        }
        var toChangeTest = { _id: ObjectId(testId) }
        var newValues = { isCalculated: true }

        conn.get().collection('Tests').update(toChangeTest, { $set: newValues }, function (err, testdata) {
            if (err) {
                console.log("collection('Tests').update", err)
                return next(err);
            }

            self.marksCalculation(testId, userid, res)
        })

    },

    marksCalculation: function (testId, userid, res) {
        var userTestsData = [];
        var questionsLength = 0;
        var uid = '';

        conn.get().collection("Tests").find({ _id: ObjectId(testId) }).toArray(function (err, tests) {
            if (err) {
                return next(err);
            }
            questionsLength = tests[0].qIds.length

            conn.get().collection("UserTests").find({ testId: testId }).toArray(function (err, result) {
                if (err) {
                    return next(err);
                }
                userTestsData = result;

                conn.get().collection("UserAnswers").find({ testid: testId }).toArray(function (err, data1) {
                    if (err) {
                        return next(err);
                    }
                    for (var i = 0; i < userTestsData.length; i++) {
                        var mks = 0
                        for (var j = 0; j < data1.length; j++) {

                            if (userTestsData[i].userId === data1[j].userid) {
                                uid = data1[j].userid;
                                mks += data1[j].mark;
                            }
                        }
                        var grade = ((mks / questionsLength) * 100).toFixed(2);
                        var tochange = { testId: testId, userId: uid }
                        var percentage = { Marks: grade };
                        conn.get().collection("UserTests").update(tochange, { $set: percentage }, function (err, result) {
                            if (err) {
                                return next(err);
                            }
                        })
                    }

                })
            })
        })
    },
    adminCalculateResult: function (req, res, next) {
        var testData = req.body;
        var allQuestions = [];
        var allAnswers = [];

        conn.get().collection('Questions').find().toArray(function (err, data) {
            if (err) {
                return next(err);
            }
            allQuestions = data;

            conn.get().collection('UserAnswers').find().toArray(function (err, result) {
                if (err) {
                    return next(err);
                }
                allAnswers = result;
                self.adminCalculateResultData(allQuestions, allAnswers, testData.testid);

            });

            res.json("Admin calculated marks sucessfully");
        });
    },

    adminCalculateResultData: function (allQuestions, allAnswers, testId) {
        var correctans = [];
        var questAns = [];
        var userAns = [];
        var cmplen = 0;
        var arrtest = [];

        for (var i = 0; i < allAnswers.length; i++) {
            if (allAnswers[i].testid == testId) {
                for (var j = 0; j < allQuestions.length; j++) {
                    if (allQuestions[j]._id == allAnswers[i].questionid) {
                        if (allAnswers[i].questionType == 'mcq') {
                            cmplen = 0;
                            questAns = allQuestions[j].answer.split(',');
                            userAns = allAnswers[i].selection.slice();
                            for (var o = 0; o < questAns.length; o++) {
                                for (var n = 0; n < userAns.length; n++) {
                                    if (questAns[o].toLowerCase() == userAns[n].toLowerCase()) {
                                        cmplen = cmplen + 1;
                                    }
                                }
                            }

                            if (cmplen > 0 && cmplen == questAns.length && questAns.length == questAns.length) {
                                correctans.push({ questionid: allAnswers[i].questionid, userid: allAnswers[i].userid, iscorrect: true, id: allAnswers[i]._id, testid: allAnswers[i].testid, mark: 1 })
                            }
                        }
                        else if (allAnswers[i].questionType == 'boolean') {
                             var isBooleanAnswer ='';
                             if(allAnswers[i].selection == 'option1')
                             {
                                isBooleanAnswer ='True';
                             }
                             else if(allAnswers[i].selection == 'option2')
                             {
                                isBooleanAnswer ='False';
                             }
                            // if (allQuestions[j].answer == allAnswers[i].selection) {
                            if (allQuestions[j].answer == isBooleanAnswer) {
                                correctans.push({ questionid: allAnswers[i].questionid, userid: allAnswers[i].userid, iscorrect: true, id: allAnswers[i]._id, testid: allAnswers[i].testid, mark: 1 })
                            }
                        }
                        else if (allAnswers[i].questionType == 'numeric') {
                            if (allQuestions[j].answer == allAnswers[i].selection) {
                                correctans.push({ questionid: allAnswers[i].questionid, userid: allAnswers[i].userid, iscorrect: true, id: allAnswers[i]._id, testid: allAnswers[i].testid, mark: 1 })
                            }
                        }
                        else if (allAnswers[i].questionType == 'text') {
                            if (allQuestions[j].answer == allAnswers[i].selection) {
                                correctans.push({ questionid: allAnswers[i].questionid, userid: allAnswers[i].userid, iscorrect: true, id: allAnswers[i]._id, testid: allAnswers[i].testid, mark: 1 })
                            }
                        }
                    }
                }
            }

        }

        for (var k = 0; k < correctans.length; k++) {
            var tochange = { _id: correctans[k].id };
            var newValue = { iscorrect: correctans[k].iscorrect, mark: correctans[k].mark }

            conn.get().collection("UserAnswers").update(tochange, { $set: newValue }, function (err, result1) {
                if (err) {
                    return next(err);
                }
            });

        }

        for (var i = 0; i < allAnswers.length; i++) {
            if (allAnswers[i].testid == testId) {

                var tochange = { _id: ObjectId(allAnswers[i]._id) }
                var newValue = { isanswered: true }
                conn.get().collection('UserAnswers').update(tochange, { $set: newValue }, function (err, ansUpdate) {
                    if (err) {
                        return next(err);
                    }
                })

            }
        }

        var toChangeTest = { _id: ObjectId(testId) }
        var newValues = { iscalculated: true }

        conn.get().collection('Tests').update(toChangeTest, { $set: newValues }, function (err, testdata) {
            if (err) {
                return next(err);
            }

            self.marksCalculationByAdmin(testId)
        })
    },

    marksCalculationByAdmin: function (testId) {
        var userTestsData = [];
        var questionsLength = 0;
        var uid = '';

        conn.get().collection("Tests").find({ _id: ObjectId(testId) }).toArray(function (err, tests) {
            if (err) {
                return next(err);
            }
            questionsLength = tests[0].qIds.length


            conn.get().collection("UserTests").find({ testId: testId }).toArray(function (err, result) {
                if (err) {
                    return next(err);
                }
                userTestsData = result;

                conn.get().collection("UserAnswers").find({ testid: testId }).toArray(function (err, data1) {
                    if (err) {
                        return next(err);
                    }
                    for (var i = 0; i < userTestsData.length; i++) {
                        var mks = 0
                        for (var j = 0; j < data1.length; j++) {

                            if (userTestsData[i].userId === data1[j].userid) {
                                uid = data1[j].userid;
                                mks += data1[j].mark;
                            }
                        }
                        var grade = ((mks / questionsLength) * 100).toFixed(2);
                        var tochange = { testId: testId, userId: uid }
                        var percentage = { Marks: grade };
                        conn.get().collection("UserTests").update(tochange, { $set: percentage }, function (err, result) {
                            if (err) {
                                return next(err);
                            }
                        })
                    }

                })
            })
        })
    }

}

module.exports = self;