var express = require('express');
var router = express.Router();
let userController = require('../controllers/users');
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
let { checkLogin } = require('../utils/authHandler');
let { RegisterValidator, ChangePasswordValidator, handleResultValidator } = require('../utils/validatorHandler');
const fs = require('fs');
const path = require('path');

const privateKey = fs.readFileSync(path.join(__dirname, '../jwt.key'), 'utf8');

/* Register */
router.post('/register', RegisterValidator, handleResultValidator, async function (req, res, next) {
    try {
        let newUser = userController.CreateAnUser(
            req.body.username,
            req.body.password,
            req.body.email,
            "69aa8360450df994c1ce6c4c"
        );
        await newUser.save();
        res.send({ message: "dang ki thanh cong" });
    } catch (error) {
        res.status(500).send("Lỗi đăng ký: " + error.message);
    }
});

/* Login */
router.post('/login', async function (req, res, next) {
    let { username, password } = req.body;
    let getUser = await userController.FindByUsername(username);

    if (!getUser) {
        res.status(403).send("tai khoan khong ton tai");
    } else {
        if (getUser.lockTime && getUser.lockTime > Date.now()) {
            res.status(403).send("tai khoan dang bi ban");
            return;
        }

        if (bcrypt.compareSync(password, getUser.password)) {
            await userController.SuccessLogin(getUser);
            let token = jwt.sign(
                { id: getUser._id }, 
                privateKey, 
                { 
                    algorithm: 'RS256', 
                    expiresIn: '30d' 
                }
            );
            res.send(token);
        } else {
            await userController.FailLogin(getUser);
            res.status(403).send("thong tin dang nhap khong dung");
        }
    }
});

/* Get Profile */
router.get('/me', checkLogin, function (req, res, next) {
    res.send(req.user);
});

/* Change Password */
router.post('/change-password', checkLogin, ChangePasswordValidator, handleResultValidator, async function (req, res) {
    const { oldpassword, newpassword } = req.body;
    if (bcrypt.compareSync(oldpassword, req.user.password)) {
        await userController.ChangePassword(req.user, newpassword);
        res.send({ message: "Đổi mật khẩu thành công" });
    } else {
        res.status(400).send("Mật khẩu cũ không chính xác");
    }
});

module.exports = router;