let jwt = require('jsonwebtoken');
let userController = require('../controllers/users');
const fs = require('fs');
const path = require('path');

const publicKey = fs.readFileSync(path.join(__dirname, '../jwt.key.pub'), 'utf8');

module.exports = {
    checkLogin: async function (req, res, next) {
        let token = req.headers.authorization;
        if (!token || !token.startsWith("Bearer ")) {
            return res.status(403).send("ban chua dang nhap");
        }
        token = token.split(" ")[1];
        
        try {
            let result = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
            
            let user = await userController.FindById(result.id);
            if (!user) {
                return res.status(403).send("ban chua dang nhap");
            } else {
                req.user = user;
                next();
            }
        } catch (error) {
            console.log("JWT Verify Error:", error.message); 
            res.status(403).send("token khong hop le hoac het han");
        }
    }
}