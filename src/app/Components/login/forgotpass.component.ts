import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../Services/login.service';
import { ConfirmationDialogService } from '../confirmationdialog/confirmation-dialog.service';

@Component({
  selector: 'app-forgotpass',
  templateUrl: './forgotpass.component.html'
})
export class ForgotpassComponent implements OnInit {
  frmForgotPass: FormGroup;
  submitted = false;
  emsg: any;
  constructor(private fb: FormBuilder,
    private router: Router,
    private loginSvc: LoginService,
    private confirmationDialogService: ConfirmationDialogService
  ) { }

  ngOnInit() {
    this.frmForgotPass = this.fb.group({
      semail: ['', Validators.required]
    });
  }

  get frm() { return this.frmForgotPass.controls; }

  onCancel() {
    this.router.navigate(['/']);
  }

  submit(model: any, isValid: boolean, e: any) {
    if (!isValid) {
      this.submitted = true;
      e.preventDefault();
      return;
    } else {
      const user = { email: model.semail, urlFrom: 'admin' };
      this.loginSvc.checkEmail(user).subscribe((resp: Response) => {
        this.emsg = resp;
        this.confirmationDialogService.confirm('', this.emsg, false)
          .then((confirmed) => { })
          .catch();
        this.router.navigate(['']);
      });
    }
  }
}
