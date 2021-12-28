import Router from 'koa-router';
import posts from './posts';
import auth from './auth';
import resume from './resume';

const api = new Router();

api.use('/posts', posts.routes());
api.use('/auth', auth.routes());
api.use('/resume', resume.routes());

export default api;