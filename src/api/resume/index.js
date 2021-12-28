import Router from 'koa-router';
import * as resumeCtrl from './resume.ctrl';
import checkLoggedIn from '../../lib/checkLoggedIn';

const resume = new Router();

resume.get('/',resumeCtrl.list);
resume.post('/write',checkLoggedIn,resumeCtrl.write);

resume.use('/:id', resumeCtrl.getResumeById, resume.routes());

export default resume;