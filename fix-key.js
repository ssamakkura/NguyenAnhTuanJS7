const crypto = require('crypto');
const fs = require('fs');

try {
    const privateKey = fs.readFileSync('./jwt.key', 'utf8');

    const publicKey = crypto.createPublicKey(privateKey);
    fs.writeFileSync('./jwt.key.pub', publicKey.export({
        type: 'spki',
        format: 'pem'
    }));

    console.log("===> Đã tạo file jwt.key.pub thành công!");
} catch (error) {
    console.error("Lỗi:", error.message);
}