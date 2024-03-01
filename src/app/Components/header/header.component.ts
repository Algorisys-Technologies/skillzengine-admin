import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  loginState: any = {};
  message = '';
  userName = '';
  showMenu = true;
  pageClass: string = "page";
  scrollClass: string = "side-navbar mCustomScrollbar _mCS_1";

  constructor(private router: Router) {
    this.loginState = JSON.parse(sessionStorage.getItem('loginState'));
    this.userName = this.loginState.user.name;
  }

  ngOnInit() {

  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
    if (this.showMenu) {
      this.pageClass = 'page';
      this.scrollClass = 'side-navbar mCustomScrollbar _mCS_1'
    } else {
      this.pageClass = "page active";
      this.scrollClass = 'side-navbar mCustomScrollbar _mCS_1 shrink';
    }
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['']);
  }
}
