import {CommonService} from './common.service';
import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root'
  })
export class ResultsService {
    constructor(private commonService: CommonService) { }

    all = () => {
        return this.commonService.post('/RAll');
    }

    allUserAnswers = () => {
        return this.commonService.post('/AllUserAnswers');
    }

    allUsers = () => {
        return this.commonService.post('/AllUsers');
    }

    loginUser = (userId) => {
        return this.commonService.post('/LoginUser', {'id': userId});
    }

    getQuestions = (testid) => {
        return this.commonService.post('/GetQuestions', {'testid': testid});
    }

    getQstAnswNames = (id) => {
        return this.commonService.post('/GetQstAnswNames', {'qid': id});
    }

    selectedAnswers = (testid, uid) => {
        return this.commonService.post('/SelectedAnswers', {'userid': uid, 'tid': testid});
    }

    updateTextans = (uansid, uans, mark) => {
        return this.commonService.post('/UpdateTextans', {'useransid': uansid, 'uanswer': uans, 'mark': mark});
    }

    resultShow = () => {
        return this.commonService.post('/ResultShow');
    }

    getTestWiseResults = (testid) => {
        return this.commonService.post('/GetTestWiseResults', {'testId': testid});
    }

    updateTestMarks = (obj) => {
        return this.commonService.post('/UpdateTestMarks', obj);
    }

    updateSpecificTestMarks = (obj) => {
        return this.commonService.post('/UpdateSpecificTestMarks', obj);
    }

    // getTestWiseMarks = (obj) => {
    //     return this.commonService.post('/GetTestWiseMarks', obj);
    // }

    getTestWiseMarks = (testid) => {
        return this.commonService.post('/GetTestWiseMarks', {'testId': testid});
    }

    getUserWiseMarks = (obj) => {
        return this.commonService.post('/GetUserWiseMarks', obj);
    }

    getQuestionsAndAnswers = (obj) => {
        return this.commonService.post('/GetQuestionsAndAnswers', obj);
    }
    updateTextAnswers = (answersArray) => {
        return this.commonService.post('/UpdateTextAnswers', {answersArray});
    }
}
