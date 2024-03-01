import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../Services/login.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Response } from '@angular/http';
import { ConfirmationDialogService } from '../../confirmationdialog/confirmation-dialog.service';
@Component({
  selector: 'app-resetpass',
  templateUrl: './resetpass.component.html'
})
export class ResetpassComponent implements OnInit {
  error = '';
  submitted = false;
  frmReset: FormGroup;
  constructor(private fb: FormBuilder, private loginService: LoginService, private router: Router, private confirmationDialogService: ConfirmationDialogService) { }

  ngOnInit() {
    const regExp = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/);
    this.frmReset = this.fb.group({
      newpassword: ['', [Validators.required, Validators.pattern(regExp)]],
      conpassword: ['', Validators.required]
    });
  }
  get f() { return this.frmReset.controls; }

  submit(model, valid, e) {
    if (!valid) {
      this.submitted = true;
      e.preventDefault();
      return;
    } else {
      const d = new Date();
      const id = window.location.search.substr(1).split('&');
      const date = id[1].split('=');
      const utime = new Date(decodeURIComponent(date[1]));
      const newid = id[0].split('=');
      if (d > utime) {
        this.error = 'The link has expired';
        return;
      } else {
        this.loginService.resetPass({ id: newid[1], new: model.newpassword, urlFrom: 'admin' }).subscribe((response: Response) => {
          this.confirmationDialogService.confirm('', response.toString(), false)
            .then((confirmed) => { })
            .catch();
          this.router.navigate(['']);
        });
      }
    }
  }
}
