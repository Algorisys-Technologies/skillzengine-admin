
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jwt = require("jsonwebtoken");
var conn = require('./db');
var config = require('./Config/configuration');
var crypto = require('crypto');

var dbConnection = null;
var secretKey = '08970a0d-8f08-4994-9d6b-1732f7e14942';
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));



var _userdb = require('./dblayer/userdb');
var _testdb = require('./dblayer/testdb');
var _groupdb = require('./dblayer/groupdb');
var _questdb = require('./dblayer/questionsdb');
var _catdb = require('./dblayer/categorydb');
var _fileuploaddb = require('./dblayer/fileUploaddb');
var _instructionsdb = require('./dblayer/instructionsdb');


// Dont change sequence of calling function as it does not have jwt authentication hence written above.
router.get('/VerifyMail', _userdb.verifyMail);
router.post('/GetActiveTest', _testdb.getActiveTest)
router.post('/GetByUsersName', _userdb.getByUsersName);
router.post('/GetByMultipleUsersName', _userdb.getByMultipleUsersName);

router.post('/CreateUser', _userdb.createUser);
router.post('/CreateMultipleUser', _userdb.createMultipleUser);

router.post('/CheckEmail', _userdb.checkEmail);
router.post('/ResetPass', _userdb.resetPass);



router.post('/DoLogin', doLogin);


function doLogin(req, res, next) {
    var user = req.body;
    var obj = {};


    saltHashPassword(user.password);

    function sha512(password, salt) {
        var hash = crypto.createHmac('sha512', salt);
        hash.update(password);
        var value = hash.digest('hex');
        return {
            salt: salt,
            passwordHash: value
        };
    }

    function saltHashPassword(pass) {

        
        var salt = config.salt; 
        var passwordData = sha512(pass, salt);
        user.password = passwordData.passwordHash;

        if (JSON.stringify(user) != JSON.stringify({})) {
            var p = "^" + user.userName + "$";
            conn.get().collection('users').find({ name: { $regex: p, $options: "i" }, password: user.password}).toArray(function (err, result) {
                if (err) {
                    return next(err);
                }

                /*Checking the condition in case user puts wrong credentials service should not go down. 
                  This will not set array with token as array were empty */
                if (result.length > 0) {
                    var token = jwt.sign(obj, secretKey, {
                        expiresIn: 60 * 60 * 24 // expires in 24 hours
                    });
                    result[0].token = token;
                    delete result[0]['password'];
                }
                res.json(result);
            });
        }
    }
}

router.post('/LoginDetails', _userdb.loginDetails);
router.post('/GetByTestId', _testdb.getByTestId);
router.post('/TestByGroup', _testdb.testByGroup);
router.post('/Add', _testdb.add);
router.post('/All', _testdb.all);
router.post('/GetMyTests', _testdb.getMyTests);
router.post('/DeleteTest', _testdb.deleteTest);
router.post('/UpdateTest', _testdb.updateTest);
router.post('/RAll', _testdb.rAll);
router.post('/GetUserTests', _testdb.getUserTests);
router.post('/GetAllUserTests', _testdb.getallUserTests);


router.post('/UpdateIscalTest', _testdb.updateIscalTest);

router.post('/UpdateTestStatusAll', _testdb.updateTestStatusAll);
router.post('/UpdateTestStatusById', _testdb.updateTestStatusById);
router.post('/UpdateMarks', _testdb.updatemarks);

router.post('/QAll', _questdb.qall);
router.post('/QByCategory', _questdb.qByCategory);

router.post('/QgetById', _questdb.qgetById);
router.post('/QUpdate', _questdb.qUpdate);
router.post('/QDelete', _questdb.qDelete);
router.post('/QAdd', _questdb.qAdd);

router.post('/UploadFile', _fileuploaddb.save);
router.post('/RemoveFile', _fileuploaddb.remove);


router.post('/UpdateStatus', _userdb.updateStatus);
router.post('/UpdateUser', _userdb.updateUser);
router.post('/AllAnswers', _userdb.allAnswers);
router.post('/GetAllUsers', _userdb.getAllUsers);
router.post('/AllUserTest', _userdb.allusertest);
router.post('/GetSelectedUsersforTest', _userdb.getSelectedUsersforTest);
router.post('/AssignTests', _userdb.assignTests);
router.post('/FindById', _userdb.findById);
router.post('/Insert', _userdb.insert);
router.post('/Update', _userdb.update);

router.post('/UpdateAnswer', _userdb.updateAnswer);
router.post('/GetBytestIduserid', _userdb.getBytestIduserid);
router.post('/UpdateUserAnswers', _userdb.updateUserAnswers);
router.post('/UpdateUserTests', _userdb.updateUserTests);
router.post('/AllUserAnswers', _userdb.allUserAnswers);
router.post('/AllUsers', _userdb.allUsers);
router.post('/DeleteUserTests', _userdb.deleteUserTests);
router.post('/DeleteUser', _userdb.deleteUserRecord);
router.post('/DeleteUserByName', _userdb.deleteUserByName);
router.post('/DeleteUserTestAnswers', _userdb.deleteUserTestsAnswers);
router.post('/DeleteUserAnswer', _userdb.deleteUserAnswer);

router.post('/UserList', _userdb.userList);
router.post('/GetAllAnsGetByTestId', _userdb.getAllAnsGetByTestId);
router.post('/UpdateAllAnswer', _userdb.updateAllAnswer);
router.post('/EditUser', _userdb.editUserRecord);
router.post('/LoginUser', _userdb.loginUser);
router.post('/UpdateAnswerModel', _userdb.updateAnswerModel);
router.post('/UpdateUserTimer', _userdb.updateUserTimer);
router.post('/GetUserTimer', _userdb.getUserTimer);
router.post('/UpdateUserRetest', _userdb.updateUserRetest);
router.post('/AssignedTestMail', _userdb.assignedTestMail);
router.post('/RequestRetest', _userdb.requestRetest);
router.post('/GetRetestNotifications', _userdb.getRetestNotifications);
router.post('/UpdateRetestNotifications', _userdb.updateRetestNotifications);
router.post('/InsertRetestNotifications', _userdb.insertRetestNotifications);

router.post('/Editcategory', _catdb.editcategoryRecord);
router.post('/Deletecategory', _catdb.deletecategoryRecord);
router.post('/Createcategory', _catdb.createcategory);
router.post('/CategoryList', _catdb.categoryList);
router.post('/DeleteCategoryWiseQuestions', _catdb.deleteCategoryWiseQuestions);




router.post('/Editgroup', _groupdb.editgroupRecord);
router.post('/Deletegroup', _groupdb.deletegroupRecord);
router.post('/Creategroup', _groupdb.creategroup);
router.post('/GroupList', _groupdb.groupList);


router.post('/GetQuestions', _questdb.getQuestions);
router.post('/GetQstAnswNames', _questdb.getQstAnswNames);
router.post('/SelectedAnswers', _questdb.selectedAnswers);
router.post('/UpdateTextans', _userdb.updateTextans);
router.post('/ResultShow', _userdb.resultShow);
router.post('/GetTestWiseResults', _userdb.getTestWiseResults);
router.post('/UpdateTestMarks', _userdb.updateTestMarks);

router.post('/GetMarksCalculateMessage', _userdb.getMarksCalculateMessage)
router.post('/OnSubmit', _userdb.onSubmit);

router.post('/FindtestbyIds', _userdb.findtestbyIds);


router.post('/GetSubmitMarks', _userdb.getSubmitMarks);
router.post('/UserTestResult', _userdb.userTestResult);
router.post('/AdminCalculateResult', _userdb.adminCalculateResult);
router.post('/GetTodaysGivenTests', _testdb.getTodaysGivenTests);
router.post('/GetTestWiseMarks', _testdb.getTestWiseMarks);
router.post('/GetUserWiseMarks', _testdb.getUserWiseMarks);
router.post('/GetQuestionsAndAnswers', _testdb.getQuestionsAndAnswers);
router.post('/UpdateTextAnswers', _testdb.updateTextAnswers);



router.post('/InsertInstructions', _instructionsdb.insertInstructions);
router.post('/GetInstructions', _instructionsdb.getInstructions);
router.post('/RemoveInstructions', _instructionsdb.removeInstructions);
router.post('/GetUserTestsAndTests', _testdb.getUserTestsAndTests);




module.exports = router;