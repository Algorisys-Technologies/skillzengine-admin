import {CommonService} from './common.service';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
@Injectable({
    providedIn: 'root'
  })
export class AssignedTestService {
    constructor(private commonService: CommonService,private fb: FormBuilder) {}


    assignTests = userTests => {
        const obj: any = {};
        obj.userTests = userTests;
        return this.commonService.post('/AssignTests', obj);
    }

    deleteUserTests = obj =>  {
        return this.commonService.post('/DeleteUserTests', obj);
    }

    getSelectedUsersforTest = testId =>  {
            return this.commonService.post('/GetSelectedUsersforTest', { 'testId': testId });
    }

    deleteUserTestAnswers = details => {
        return this.commonService.post('/DeleteUserTestAnswers', details);
    }

    assigntest = this.fb.group({
        groupId:[{value:[],disabled:false},(Validators.required)],
        testId:[{value:[],disabled:false},(Validators.required)],
        testName:[{value:'',disabled:false},(Validators.nullValidator)],
        marks:[{value:0,disabled : false},(Validators.nullValidator)],
        issubmit:[{value:false,disabled : false},(Validators.nullValidator)],
        category:[{value:'',disabled : false},(Validators.nullValidator)],
        userId:[{value:'',disabled : false},(Validators.nullValidator)],
        userName:[{value:'',disabled : false},(Validators.nullValidator)],
        timeTaken:[{value:0,disabled : false},(Validators.nullValidator)],
        issubmitdate:[{value:new Date(),disabled : false},(Validators.nullValidator)],
        isRetest:[{value:'',disabled : false},(Validators.nullValidator)],
        retestCtr:[{value:'',disabled : false},(Validators.nullValidator)],
        retestDate:[{value:new Date(),disabled : false},(Validators.nullValidator)],
        isStarted:[{value:false,disabled : false},(Validators.nullValidator)],
        isShowTest:[{value:true,disabled : false},(Validators.nullValidator)],
        startDate:[{value:'',disabled : false},(Validators.required)],
        endDate:[{value:'',disabled : false},(Validators.required)],
      });

      convertToDateFormat(str) { //converts date to YYYY-MM-DD Format
        var date = new Date(str),
            mnth = ("0" + (date.getMonth()+1)).slice(-2),
            day  = ("0" + date.getDate()).slice(-2);
        return [ date.getFullYear(), mnth, day ].join("-");
    }

}
