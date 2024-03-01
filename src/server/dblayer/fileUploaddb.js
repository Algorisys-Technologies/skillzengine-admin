// include node fs module
var fs = require('fs');
const path = require("path");
//let uploadFolder = './public/uploads';
let uploadFolder1 = '../dist/testengine/uploads';
let uploadFolder = '../../dist/testengine/uploads';
var self = module.exports = {

    save: function (req, res) {
        if (!req.files.file) {
            res.send({ "error": "No files were uploaded." });
            return;
        }
        var idFolder = req.body.uniqueId;
        var uploadedFile = req.files.file;
        let fileUploaded = uploadedFile.name.split('.');
        let fileExtn = fileUploaded[fileUploaded.length - 1].toUpperCase();
        let validFileExtn = ['PNG', 'JPEG', 'JPG', 'GIF', 'PDF'];
        let isValidFileExtn = validFileExtn.filter((extn) => extn === fileExtn);
        let folder = path.join(__dirname, uploadFolder);
        if (isValidFileExtn.length > 0) {
            if (fs.existsSync(folder + "/" + idFolder)) {
                uploadedFile.mv(folder + "/" + idFolder + "/" + req.files.file.name, function (err) {
                    if (err) {
                        res.send({ "error": "File Not Saved." });
                    }
                    else {
                        res.send({ "error": "", "message": uploadedFile.name });
                    }
                });
            } else {
                fs.mkdir(folder + '/' + idFolder, function (err) {
                    if (err) {
                        return console.error(err);
                    }
                    uploadedFile.mv(folder + "/" + idFolder + "/" + req.files.file.name, function (err) {
                        if (err) {
                            res.send({ "error": "File Not Saved." });
                        }
                        else {
                            res.send({ "error": "", "message": uploadedFile.name });
                        }
                    });

                });
            }

        } else {
            res.send({ "error": "Invalid File." });
        }

    },
    remove: function (req, res, next) {
        var data = req.body;
        if (!data.fileName) {
            res.send({ "error": "No files were uploaded." });
            return;
        }
        let folder = path.join(__dirname, uploadFolder);
        var fileToBeDeleted = folder + "/" + data.uniqueId + "/" + data.fileName;
        try {
            fs.unlink(fileToBeDeleted, function (err) {
                if (err) {
                }
                else {
                }
            });
        } catch (e) {
        }
        res.send({ "message": "File deleted." });
    }
}
module.exports = self;