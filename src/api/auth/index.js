import Router from 'koa-router';
import * as authCtrl from './auth.ctrl';

const auth = new Router();

auth.post('/register', authCtrl.register); // 회원가입
auth.post('/login', authCtrl.register); // 로그인
auth.post('/check', authCtrl.register); // 중복체크
auth.post('/logtou', authCtrl.register); // 로그아웃 - 세션해제

export default auth;