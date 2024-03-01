const salt = "$1$yINS4V7n$zNBle36ifDC613WLrrkyM.sdffhj&*^&^*%&ghhkh$%&*";
const adminUrl = "https://skillzengine.com/admin";
const clientUrl = "https://skillzengine.com/client";
//const adminUrl = "http://localhost:4200";
const from = "appquiz6@gmail.com";
const host = "smtp.gmail.com";
const port = 465;
const secure = true;
const auth = {
    user: "appquiz6@gmail.com",
    pass: "algorisys"
};
module.exports = {
    salt: salt,
    adminUrl: adminUrl,
    clientUrl: clientUrl,
    host: host,
    port: port,
    secure: secure,
    auth: auth,
    from: from
};