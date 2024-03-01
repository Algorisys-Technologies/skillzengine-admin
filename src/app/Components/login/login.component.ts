import { Component, OnInit,  EventEmitter, Output} from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Response } from '@angular/http';
import { Router } from '@angular/router';
import { LoginService } from '../../Services/login.service';
import { LoaderService } from '../../Services/loader.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  frmLogin: FormGroup;
  submitted = false;
  error = '';
  errorflg: boolean = false;

  

  constructor(private fb: FormBuilder, private loginSvc: LoginService, private router: Router,private loaderService: LoaderService) { }

  ngOnInit() {
    this.frmLogin = this.fb.group({
      userName: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });


  }

  get f() { return this.frmLogin.controls; }

  submit(model: any, isValid: boolean, e: any) {

    if (!isValid) {
      this.submitted = true;
      e.preventDefault();
      return;
    } else {
      const user = {
        userName: model.userName,
        password: model.password,
        group: 'admin'
      };
      this.loginSvc.doLogin(user).subscribe((response: Response) => {
        const usr: any = response;
        this.loaderService.appLoader=true;
        const loggedInUser = usr[0];
        if (loggedInUser) {
          const loginState: any = {};
          loginState.user = loggedInUser;
          loginState.userId = loggedInUser._id;
          loginState.isLoggedIn = true;
          loginState.role = loggedInUser.group;
          loginState.username = loggedInUser.name;
          sessionStorage.setItem('loginState', JSON.stringify(loginState));
          sessionStorage.setItem('isloggedIn', 'true');
          sessionStorage.setItem('isActive', JSON.stringify(loggedInUser.isActive));
          sessionStorage.setItem('token', usr[0].token);
          if (loggedInUser.isActive === false) {
            this.errorflg = true;
            this.error = 'Please verify your email !!';
            this.loaderService.appLoader=false;
          }
          else if (loggedInUser.group === 'user' || loggedInUser.group === 'User') {
            this.errorflg = true;
             this.error = "You don't have login permission, only admin can login!";
             this.loaderService.appLoader=false;
          }
           else {
            this.errorflg = false;
            this.router.navigate(['landing']);
            this.loaderService.appLoader=false;
          }
          
        } else if (!loggedInUser) {
          this.errorflg = true;
          this.error = 'Invalid user name or password';
          this.loaderService.appLoader=false;
        }
      },
        (error) => {
          this.errorflg = true;
          this.loaderService.appLoader=false;
        });
    }
  }

}
