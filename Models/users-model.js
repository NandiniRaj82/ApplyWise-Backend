const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    
});

async function saveUser(user) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashpass = await bcrypt.hash(user.password, salt);
      user.password = hashpass;
    } catch (error) {
      throw error;
    }   
}
  
userSchema.pre('save', async function(next) {
    await saveUser(this);
    next();
});

userSchema.methods.comparePassword = async function(userPassword) {
    try {
        const isMatch = await bcrypt.compare(userPassword, this.password);
        return isMatch;
    } catch (error) {
        throw error;
    }
};

const UserModel = mongoose.model("User", userSchema);
module.exports = {
    UserModel
};