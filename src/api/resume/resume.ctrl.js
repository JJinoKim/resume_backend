import Resume from '../../models/resume';
import mongoose from 'mongoose';
import Joi from 'joi';
import { object } from '../../../node_modules/joi/lib/index';

const { ObjectId } = mongoose.Types;

export const getResumeById = async (ctx, next) => {
    const {user} = ctx.params;
    if(!ObjectId.isValid(user)){
        ctx.status = 400;
        return;
    }

    try{
        const resume = await Resume.findById(id);
        if(!resume){
            ctx.status = 404;
            return;
        }
        ctx.state.resume = resume;
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
        ctx.body = resumeList.map(resume => ({
            ...resume,
            body: resume.body.length < 200 ? resume.body : `${resume.body.slice(0,200)}...`,
        }));
    }catch(e){
        ctx.throw(500,e);
    }
}

export const write = async (ctx) => {
    const schema = Joi.object().keys({
        user : Joi.object().keys({
            userId: Joi.string().required(),
            username: Joi.string().required(),
        }).required(),
        gender : Joi.string(),  // 성별
        birth : Joi.string(), // 생년월일
        email : Joi.string().required(), // 이메일
        phone_c : Joi.string().required(),   // 휴대폰번호
        phone_t : Joi.string().required(),   // 전화번호
        address : object().keys({
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
            .item(Joi.object().keys({
                company: Joi.string().required(),
                period: Joi.string().required(),
                department: Joi.string().required(),
                position: Joi.string().required(),
                etc: Joi.string(),
            })),
        experience : Joi.array()
            .item(Joi.object().keys({
                title: Joi.string().required(),
                agency: Joi.string(),
                period: Joi.string(),
                contents: Joi.string(),
            })),
        license : Joi.array()
            .item(Joi.object().keys({
                title: Joi.string().required(),
                date: Joi.string(),
            })),
        award : Joi.array()
            .item(Joi.object().keys({
                title: Joi.string().required(),
                date: Joi.string(),
            })),
        skill : Joi.array()
            .item(Joi.object().keys({
                name: Joi.string().required(),
                level: Joi.string(),
            })),
        id : String,
    })
}