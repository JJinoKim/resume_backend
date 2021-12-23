import Post from '../../models/post';
import mongoose from 'mongoose';
import Joi from 'joi';

const { ObjectId } = mongoose.Types;

export const checkObjectId = (ctx, next) => {
    const {id} = ctx.params;
    if(!ObjectId.isValid(id)){
        ctx.status = 400;
        return;
    }
    return next();
}

export const write = async ctx => {
    console.log(ctx.request.body)
    const schema = Joi.object().keys({
        // 객체가 다음 필드를 가지고 있음을 검증
        title: Joi.string().required(), // required()가 있으면 필수 항목
        body: Joi.string().required(),
        tags: Joi.array()
            .items(Joi.string())
            .required(), // 문자열로 이루어진 배열
        });
    const result = schema.validate(ctx.request.body);
    if(result.error) {
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }
    const { title, body, tags } = ctx.request.body;
    const post = new Post({
        title,
        body,
        tags,
    });
    try{
        await post.save();
        ctx.body = 'success'
    }catch(e){
        ctx.throw(500,e);
    }
};

// 포스트 목록 조회
export const list = async ctx => {

    // query는 문자열이기 때문에 숫자로 변환해 주어야 합니다.
  // 값이 주어지지 않았다면 1을 기본으로 사용합니다.
/*   const page = parseInt(ctx.query.page || '1', 10);

    if (page < 1) {
        ctx.status = 400;
        return;
    }

    try {
        const posts = await Post.find()
        .sort({ _id: -1 })
        .limit(10)
        .skip((page - 1) * 10)
        .lean()
        .exec();
        const postCount = await Post.countDocuments().exec();
        ctx.set('Last-Page', Math.ceil(postCount / 10));
        ctx.body = posts.map(post => ({
        ...post,
        body: post.body.length < 200 ? post.body : `${post.body.slice(0, 200)}...`,
        }));
    } catch (e) {
        ctx.throw(500, e);
    }
 */

    try {
        const posts = await Post.find().exec();
        ctx.body = posts;
    }catch(e){
        ctx.throws(500,e);
    }
};

/*
특정 포스트 조회
*/
export const read = async ctx => {
    const { id } = ctx.params;
    try{
        const post = await Post.findById(id).exec();
        if(!post) {
            ctx.status = 404;
            return ;
        }
        ctx.body = post;
    }catch(e){
        ctx.throw(500,e);
    }
};

/*
    특정 포스트 제거
*/
export const remove = async ctx => {
    const { id } = ctx.params;
    try {
        await Post.findByIdAndDelete(id).exec();
        ctx.status = 204;
    } catch(e) {
        ctx.throw(500,e);
    }
};

// /*
//     특정 포스트 수정
// */
// export const replace = ctx => {
// };

/* 포스트 수정(특정 필드 변경)
*/
export const update = async ctx => {
    const { id } = ctx.params;
    try{
        const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
            new: true, // 이 값을 설정하면 업데이트 된 값을 반환
        }).exec();
        if(!post) {
            ctx.status = 404;
            return;
        }
    }catch(e){
        ctx.throw(500,e);
    }
}

