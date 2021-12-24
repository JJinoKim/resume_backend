import Joi from 'joi';
import User from '../../models/user';

export const register = async ctx => {
    // 회원가입
    const schema = Joi.object().keys({
        userId : Joi.string().alphanum().min(4).max(15).required(),
        username : Joi.string().alphanum().min(3).max(20).required(),
        password : Joi.string().required(),
    });
    const result = schema.validate(ctx.request.body);
    if(result.error){
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }
    const {userId, username, password} = ctx.request.body;
    try{
        //userId 있는지 확인
        const exists = await User.findByUserId(userId);
        if(exists){
            ctx.status = 409;
            return;
        }

        const user = new User({
            userId,
        });

        await user.setPassword(password); // 비밀번호 설정
        await user.save(); // 데이터 베이스에 저장

        // 응답할 데이터에서hashedPassword 필드 제거
        ctx.body = user.serialize();

        const token = user.generateToken();
        ctx.cookies.set('access_token', token,{
            maxAge : 1000 * 600 * 60 * 24 * 7, // 7 day
            httpOnly : true,
        });
    }catch(e){
        ctx.throw(500,e);
    }
};

export const login = async ctx => {
    // 로그인
    const {userId, username, password} = ctx.request.body;

    if(!userId || !password){
        ctx.status = 401;
        return;
    }

    try{
        const user = await User.findByUserId(userId);
        // 계정이 존재하지 않으면 에러
        if(!user){
            ctx.status = 401;
            return;
        }
        const valid = await user.checkPassword(password);
        // 잘못된 비밀번호
        if(!valid){
            ctx.status = 401;
            return;
        }
        ctx.body = user.serialize();
        const token = user.generateToken();
        ctx.cookies.set('access_token', token,{
            maxAge : 1000 * 600 * 60 * 24 * 7, // 7 day
            httpOnly : true,
        })

    }catch(e){
        ctx.throw(e);
    }
}

export const check = async ctx => {
    // 로그인 상태 확인
    const {user} = ctx.state;
    if(!user){
        // 로그인 중 아님
        ctx.status = 401;
        console.log(user)
        return;
    }
    ctx.body = user;
}

export const logout = async  ctx => {
    // 로그아웃
    ctx.cookies.set('access_token');
    ctx.status = 204;
}