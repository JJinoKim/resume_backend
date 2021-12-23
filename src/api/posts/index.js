import Router from 'koa-router';
import * as postsCtrl from './posts.ctrl';

const posts = new Router();


posts.get('/', postsCtrl.list);
posts.post('/', postsCtrl.write);

const post = new Router();

post.get('/:id', postsCtrl.read);
post.delete('/:id', postsCtrl.remove);
// posts.put('/:id', postsCtrl.replace);
post.patch('/:id',postsCtrl.update);

posts.use('/:id', postsCtrl.checkObjectId, posts.routes());

export default posts;
