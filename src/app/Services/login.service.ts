import {CommonService} from './common.service';
import { Injectable, EventEmitter, Output } from '@angular/core';
import { Http, Response } from '@angular/http';

@Injectable({
    providedIn: 'root'
  })
export class LoginService {
    constructor(private commonService: CommonService,
        private http: Http) {}

    loginDetails = username => {
        return this.commonService.post('/LoginDetails', username);
    }

    getByUsersName = emailId => {
        return this.commonService.post('/GetByUsersName', emailId);
    }

    getByMultipleUsersName = emailId => {
        return this.commonService.post('/GetByMultipleUsersName', emailId);
    }

    

    doLogin = user =>  {
        return this.commonService.post('/DoLogin', user);
    }

    getAllUsers = () => {
        return this.commonService.post('/GetAllUsers');
    }

    getActiveTest = () => {
        return this.commonService.post('/GetActiveTest');
    }

    delete = id => {
        return this.commonService.post('/Delete', id);
    }

    checkEmail = user => {
        return this.commonService.post('/CheckEmail', user);
    }

    resetPass = user => {
        return this.commonService.post('/ResetPass', user);
    }
}
