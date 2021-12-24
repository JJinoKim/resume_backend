import Mongoose, {Schema} from "mongoose";

const { Schema } = mongoose;

const PostSchema = new Schema({
    user : {
        _id: mongoose.Types.ObjectId,
        username: String,
    },
    gender : char,  // 성별
    birth : string, // 생년월일
    email : string, // 이메일
    phone_c : string,   // 휴대폰번호
    phone_t : string,   // 전화번호
})