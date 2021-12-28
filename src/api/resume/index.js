import Router from 'koa-router';
import * as resumeCtrl from './resume.ctrl';
import checkLoggedIn from '../../lib/checkLoggedIn';

const resume = new Router();

resume.get('/',resumeCtrl.list);
resume.post('/',checkLoggedIn,resumeCtrl.write);
resume.patch('/',checkLoggedIn, resumeCtrl.update);
resume.delete('/:id',checkLoggedIn,resumeCtrl.remove);
resume.get('/:id', resumeCtrl.getResumeById, resume.routes());

export default resume;