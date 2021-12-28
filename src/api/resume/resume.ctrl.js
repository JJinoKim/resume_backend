import Resume from '../../models/resume';
import Joi from 'joi';

export const getResumeById = async (ctx, next) => {
    const {id} = ctx.params;
    const query = {
        resumeid : id
    }
    try{
        const resume = await Resume.find(query);
        if(!resume){
            ctx.status = 404;
            return;
        }
        ctx.body = resume;
        return next();
    }catch(e){
        ctx.throw(500,e);
    }
}

export const list = async(ctx) => {
    // 페이징 처리
    const page = parseInt(ctx.query.page || '1', 10);
    // 값이 없을 때
    if(page < 1){
        ctx.status = 400;
        return;
    }

    // 조회 조건절
    const { id, userId, username } = ctx.query;

    const query = {
        ...(id ? {id : id} : {}),
        ...(userId ? {'user.userId' : userId } : {}),
        ...(username ? {'user.username' : username} : {})
    }
    console.log('resume searche 조건절 : %s',query);

    try{
        const resumeList = await Resume.find(query)
            .sort({ _id: -1})
            .limit(10)
            .skip((page-1) * 10)
            .lean()
            .exec();
        const resumeCount = await Resume.countDocuments().exec();
        ctx.set('Last-Page', Math.ceil(resumeCount / 10));
        ctx.body = resumeList;
    }catch(e){
        ctx.throw(500,e);
    }
}

export const write = async(ctx) => {
    const schema = validationSchema();
    const result = schema.validate(ctx.request.body);
    if(result.error){
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }
    const {gender,birth,email,phone_c,phone_t,address,education,career,experience,license,award,skill,code} = ctx.request.body;
    const {user} = ctx.state;
    const resumeid = new Date().getTime()+user.userId;

    try{
        const resume = new Resume({
            user,gender,birth,email,phone_c,phone_t,address,education,career,experience,license,award,skill,code,resumeid
        })
        console.log(resume)
        await resume.save();
        ctx.body = resume
    }catch(e){
        ctx.throw(500,e);
    }
}


export const update = async (ctx) => {
    const schema = validationSchema();
    const result = schema.validate(ctx.request.body);
    if(result.error){
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }
    const { _id } = ctx.request.body;
    console.log(_id)
    try{
        const resume = Resume.findByIdAndUpdate(_id, ctx.request.body, {
            new : true,
        }).exec();
        console.log(!resume);
        if(!resume){
            ctx.status = 404;
            return;
        }
        ctx.body = '수정완료';
    }catch(e){
        console.log(e)
        ctx.throw(500,e);
    }
}

export const remove = async (ctx) => {
    const {id} = ctx.params;
    const query = {
        resumeid : id
    }
    try{
        const resume = await Resume.findOne(query);
        if(!resume){
            ctx.status = 404;
            ctx.body = '지울 데이터가 없음';
            return;
        }
        await Resume.findByIdAndDelete(resume._id);
        ctx.body = 'success';
    }catch(e){
        ctx.throw(500,e);
    }
}

export const checkOwnResmue = (ctx, next) => {
    const {user, resume} = ctx.state;
    console.log(resume)
    if (resume.user._id.toString() !== user._id){
        ctx.status = 403;
        return;
    }
    return next();
}


const validationSchema = () => {
    return Joi.object().keys({
        gender : Joi.string(),  // 성별
        birth : Joi.string(), // 생년월일
        email : Joi.string().required(), // 이메일
        phone_c : Joi.string().required(),   // 휴대폰번호
        phone_t : Joi.string(),   // 전화번호
        address : Joi.object().keys({
            adr1: Joi.string(),
            adr2: Joi.string(),
            adr3: Joi.string(),
        }),
        education : Joi.object().keys({
            highSchool: Joi.string(),
            university: Joi.string(),
            graduate: Joi.string(),
            doctor: Joi.string(),
        }),
        career : Joi.array()
            .items(Joi.object().keys({
                company: Joi.string().required(),
                period: Joi.string().required(),
                department: Joi.string().required(),
                position: Joi.string().required(),
                etc: Joi.string(),
            })),
        experience : Joi.array()
            .items(Joi.object().keys({
                title: Joi.string().required(),
                agency: Joi.string(),
                period: Joi.string(),
                contents: Joi.string(),
            })),
        license : Joi.array()
            .items(Joi.object().keys({
                title: Joi.string().required(),
                date: Joi.string(),
            })),
        award : Joi.array()
            .items(Joi.object().keys({
                title: Joi.string().required(),
                date: Joi.string(),
            })),
        skill : Joi.array()
            .items(Joi.object().keys({
                name: Joi.string().required(),
                level: Joi.string(),
            })),
        code : Joi.string(),
        resumeid : Joi.string(),
        _id : Joi.string(),
    })
}