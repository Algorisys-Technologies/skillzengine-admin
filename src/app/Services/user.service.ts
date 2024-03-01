import {CommonService} from './common.service';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
@Injectable({
    providedIn: 'root'
  })
export class UserService {
   
  
    constructor(private commonService: CommonService,private fb: FormBuilder) {}

    updateStatus = status => {
        return this.commonService.post('/UpdateStatus', status);
    }

    createUser = user => {
        return this.commonService.post('/CreateUser', user);
    }

    createMultipleUser = user => {
        return this.commonService.post('/CreateMultipleUser', user);
    }

    userListService = () => {
        return this.commonService.post('/UserList');
    }

    

    getByUsersName   = (name) => {
        return this.commonService.post('/getByUsersName', {name: name});
    }

    getByMultipleUsersName   = (name) => {
        return this.commonService.post('/getByMultipleUsersName', {name: name});
    }

    
   
    

    editUser = user => {
        return this.commonService.post('/EditUser', user);
    }

    deleteUser = user => {
        
        return this.commonService.post('/DeleteUser', user);
    }

    deleteUserByName = (name) => {
        return this.commonService.post('/DeleteUserByName', {name: name});
    }


    updateUser   = user => {
        return this.commonService.post('/UpdateUser', user);
    }

    deleteUserAnswer   = user => {
        return this.commonService.post('/DeleteUserAnswer', user);
    }

    assignedTestMail   = (userId, testId) => {
        return this.commonService.post('/AssignedTestMail', {uid: userId, tname: testId});
    }

 


    user = this.fb.group({
        id:[{value:'',disabled : false},(Validators.nullValidator)],
        name:[{value:'',disabled:false},([Validators.required, Validators.email])],
        password:[{value:'',disabled:false},([Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')])],
        group:[{value:[],disabled:false},(Validators.required)],
        isActive:[{value:false,disabled:false},(Validators.nullValidator)]
        
      });

       
       
   
     
}
