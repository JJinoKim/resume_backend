import mongoose, {Schema} from "mongoose";


const ResumeSchema = new Schema({
    user : {
        _id: mongoose.Types.ObjectId,
        userId: String,
        username: String,
    },
    gender : String,  // 성별
    birth : String, // 생년월일
    email : String, // 이메일
    phone_c : String,   // 휴대폰번호
    phone_t : String,   // 전화번호
    address : {
        adr1: String,
        adr2: String,
        adr3: String
    },
    education : {
        highSchool: String,
        university: String,
        graduate: String,
        doctor: String,
    },
    career : [{
        company: String,
        period: String,
        department: String,
        position: String,
        ect: String,
    }],
    experience : [{
        title: String,
        agency: String,
        period: String,
        contents: String,
    }],
    license : [{
        title: String,
        date: String,
    }],
    award : [{
        title: String,
        date: String,
    }],
    skill : [{
        name: String,
        level: String
    }],
    code : String,
    resumeid : String,
})


const Resume = mongoose.model('Resume',ResumeSchema );
export default Resume;