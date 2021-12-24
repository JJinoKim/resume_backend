import mongoose, {Schema} from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const UserSchema = new Schema({
    username : String,
    userId : String,
    hashedPassword : String,
});

UserSchema.methods.setPassword = async function(password){
    const hash = await bcrypt.hash(password,10);
    this.hashedPassword = hash;
};

UserSchema.methods.checkPassword = async function(password){
    const result = await bcrypt.compare(password, this.hashedPassword);
    return result;
};

UserSchema.statics.findByUserId = function(userId){
    return this.findOne({userId});
};

UserSchema.methods.serialize = function(){
    const data = this.toJSON();
    delete data.hashedPassword;
    return data;
}

UserSchema.methods.generateToken = function(){
    const token = jwt.sign(
        {
            _id:this.id,
            username : this.username,
            userId : this.userId,
        },
        process.env.JWT_SECRET,
        {
            expiresIn : '7d', // 7일동안 유효함
        },
    );
    return token;
};

const User = mongoose.model('User', UserSchema);
export default User;



