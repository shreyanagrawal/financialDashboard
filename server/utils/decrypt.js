require("dotenv").config();
const crypto = require("crypto");
const algorithm = "aes-256-cbc";

const key = crypto
    .createHash("sha256")
    .update(process.env.ENCRYPTION_KEY)
    .digest();

function decrypt(encryptedText){
    const [ivHex, encryptedData] = encryptedText.split(":");

    if(!ivHex || !encryptedData){
        throw new Error("Invalid encrypted text format!!");
    }

    const iv = Buffer.from(ivHex, "hex");

    const decipher = crypto.createDecipheriv(
        algorithm,
        key,
        iv
    );

    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
}

module.exports = decrypt;