import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../../../Services/user.service';
import { Location } from '@angular/common';
import { ConfirmPasswordValidator } from './confirm-password.validator';
import { LoaderService } from '../../../Services/loader.service';
@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html'
})
export class ChangepasswordComponent implements OnInit {
  loginState: any = {};
  submitted = false;
  savedMessage: string = '';
  showMessage: boolean;
  get f() { return this.changepassword.controls; }

  constructor(private userService: UserService, 
              private fb: FormBuilder, 
              private location: Location,
              private loaderService:LoaderService
              
             ) {
    this.loginState = JSON.parse(sessionStorage.getItem('loginState'));

   
  }

  ngOnInit() {
  }

  
  changepassword= this.fb.group({
    oldPassword: [{ value: '', disabled: false }, (Validators.required)],
    newPassword: [{ value: '', disabled: false }, (Validators.required)],
    confirmPassword: [{ value: '', disabled: false }, (Validators.required)],
  }, {
           validator: ConfirmPasswordValidator.MatchPassword
  })
  
  



  changePassword() {
    this.submitted = true;
    var userdetails = {
      group: this.loginState.user.group,
      name: this.loginState.user.name,
      userId: this.loginState.userId,
      oldpassword: this.changepassword.controls["oldPassword"].value,
      newpassword: this.changepassword.controls["newPassword"].value,
      confirmPassword: this.changepassword.controls["confirmPassword"].value,
      isActive: this.loginState.user.isActive
    };
    if (this.changepassword.invalid) {
      return;
    }
    this.loaderService.appLoader =true;
    this.userService.updateUser(userdetails).
      subscribe((res: Response) => {
        this.showMessage = true;
        if (res) {
          this.showMessage = res['state'];
          this.savedMessage = res['message'];
          this.loaderService.appLoader =false;
        }
      });
  }

  cancel() {
    this.location.back(); 
  }

 

 

}


 