import {CommonService} from './common.service';
import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root'
  })
export class AnswerService {
    constructor(private commonService: CommonService) { }

    update = (answer) => {
        return this.commonService.post('/Update', { id: answer._id, selection: answer.selection, isanswered: answer.isanswered } );
    }

    updatesubmit = (answer) =>  {
        return this.commonService.post('/UpdateSubmit', { id: answer.id, issubmit: answer.issubmit } );
    }

    updateanswer = (ansid, iscorrect, mark) =>  {
        return this.commonService.post('/UpdateAnswer', { id: ansid, iscorrect: iscorrect, mark: mark } );
    }

    updateAllAnswer = (ansid) =>  {
        return this.commonService.post('/UpdateAllAnswer',  { id: ansid } );
    }

    updatemarks = (id) =>  {
        return this.commonService.post('/UpdateMarks', { id: id, iscalculated: true } );
    }

    getBytestIduserid = (testid, userid) => {
        return this.commonService.post('/GetBytestIduserid', { testid: testid, userid: userid } );
    }

    updateUserAnswers = (obj) =>  {
        return this.commonService.post('/UpdateUserAnswers', obj );
    }

    updateUserTests = (obj) =>  {
        return this.commonService.post('/UpdateUserTests', obj );
    }

    insert = (answer) =>  {
        return this.commonService.post('/Insert', answer );
    }

    deleteanswer = (answer) =>  {
        return this.commonService.post('/DeleteAnswer', answer );
    }

    allanswers = () =>  {
        return this.commonService.post('/AllAnswers');
    }

    findById = (usrid, questId, testId) =>  {
        return this.commonService.post('/FindById', { userid: usrid, questionid: questId, testid: testId });
    }

    findtestbyIds = (uid, tid)  => {
        return this.commonService.post('/FindtestbyIds', { userid: uid, testid: tid });
    }

    updateAnswerModel = (uid, qid, tid, ans) => {
        return this.commonService.post('/UpdateAnswerModel', {userid: uid, quesid: qid, testid: tid, answ: ans});
    }

    getMarksCalculateMessage = (testId) => {
        return this.commonService.post('/GetMarksCalculateMessage', {testid: testId});
    }

    updateUserTimer = (uid, tid, counter) => {
        return this.commonService.post('/UpdateUserTimer', {userid: uid, testid: tid, timer: counter});
    }


}

