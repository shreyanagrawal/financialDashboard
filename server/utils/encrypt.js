require("dotenv").config();
const crypto = require("crypto");
const algorithm = "aes-256-cbc";
const key = crypto
  .createHash("sha256")
  .update(process.env.ENCRYPTION_KEY)
  .digest();
function encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
        algorithm,
        key,
        iv
    );
    let encrypted = cipher.update(
        text,
        "utf8",
        "hex"
    );
    encrypted += cipher.final("hex");
    return iv.toString("hex") + ":" + encrypted;
}
module.exports = encrypt