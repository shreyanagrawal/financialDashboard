const mongoose = require("mongoose");
const UserTokenSchema = new mongoose.Schema({
    userId : {type: mongoose.Schema.Types.ObjectId, required: true},
    token: {type: String, required: true},
    createdAt:{type: Date, default: Date.now, expires: 30*86400}
})
const UserTokenModel = mongoose.model("usertokens",UserTokenSchema);
module.exports = UserTokenModel;