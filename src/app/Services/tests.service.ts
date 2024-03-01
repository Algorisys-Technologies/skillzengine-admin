import {CommonService} from './common.service';
import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root'
  })
export class TestsService {
    constructor(private commonService: CommonService) { }

    all = () => {
        return this.commonService.post('/All');
    }

    allusertest =  () =>  {
        return this.commonService.post('/AllUserTest');
    }

    getTestById =  (testId) =>  {
        return this.commonService.post('/GetByTestId', {testId: testId} );
    }

    deleteTest =  (obj) => {
        return this.commonService.post('/DeleteTest', obj );
    }

    updateTest =  (obj) =>  {
        return this.commonService.post('/UpdateTest', obj );
    }

    updateiscalTest =  (obj) =>  {
        return this.commonService.post('/UpdateIscalTest', obj );
    }

    updateUserRetest = (obj) => {
        return this.commonService.post('/UpdateUserRetest', obj );
    }

    add =  (tests) => {
        return this.commonService.post('/Add', tests );
    }

    updateTestStatusAll =  (obj) =>  {
        return this.commonService.post('/UpdateTestStatusAll' );
    }

    updateTestStatusById =  (obj) =>  {
        return this.commonService.post('/UpdateTestStatusById', obj );
    }

    testByGroup =  (groupid) =>  {
        const obj: any = {};
        if (groupid === '' || groupid === 'All' || groupid === undefined) {
            obj.groupid = 'All';
        } else {
            obj.groupid = groupid;
        }
        return this.commonService.post('/TestByGroup', obj );
    }

    onSubmit = (obj) => {
        return this.commonService.post('/OnSubmit', obj );
    }

}
