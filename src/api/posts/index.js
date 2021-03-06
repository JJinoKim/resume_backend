import Router from 'koa-router';
import * as postsCtrl from './posts.ctrl';
import checkLoggedIn from '../../lib/checkLoggedIn';

const posts = new Router();


posts.get('/', postsCtrl.list);
posts.post('/',checkLoggedIn, postsCtrl.write);

const post = new Router();

post.get('/:id', postsCtrl.read);
post.delete('/:id',checkLoggedIn,postsCtrl.checkOwnPost, postsCtrl.remove);
// posts.put('/:id', postsCtrl.replace);
post.patch('/:id',checkLoggedIn,postsCtrl.checkOwnPost, postsCtrl.update);

posts.use('/:id', postsCtrl.getPostById, posts.routes());

export default posts;
