import Router from 'koa-router';
import * as resumeCtrl from './resume.ctrl';

const resume = new Router();

resume.get('/',resumeCtrl.list);

resume.use('/:id', resumeCtrl.getResumeById, resume.routes());

export default resume;