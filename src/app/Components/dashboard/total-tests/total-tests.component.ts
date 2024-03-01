import { Component, OnInit } from '@angular/core';
import { TestsService } from '../../../Services/tests.service';
import { DashboardService } from '../../../Services/dashboard.service';
import { Response } from '@angular/http';
import { Router } from '@angular/router';
import { LoaderService } from '../../../Services/loader.service';
@Component({
  selector: 'app-total-tests',
  templateUrl: './total-tests.component.html'
})
export class TotalTestsComponent implements OnInit {

  loginState: any = {};
  AllTests: any = [];
  Message = '';

  tblbtns: any[] = [
    {
        title: 'Result',
        keys: ['Id'],
        action: 'calculateTestResults',
        ishide: false,
        isChkBox:false,
        isLink:true,
        routeTo:'../testresults',
        class:''
    }
];


  // columns: any[] = [
  //   {label:'Id',name: '_id'}, 
  //   {label:'Name of the Test',name: 'testName'},
  //   {label:'Action',name: ''}];
    
  columns: any[] = [
    {label:'Id',name: '_id'}, 
    {label:'Name of the Test',name: 'testName'}];
 
    


  constructor(private testsService: TestsService,
    private dashboardService: DashboardService,
    private router: Router,
    private loaderService: LoaderService) {
    this.loginState = JSON.parse(sessionStorage.getItem('loginState'));
  }

  ngOnInit() {
    this.loaderService.appLoader= true;
    this.testsService.all().subscribe((response: Response) => {
      this.AllTests = response;
      this.loaderService.appLoader= false;
    });
  }

  onCalculateTestResults = testId => {
    this.loaderService.appLoader= true;
    this.dashboardService.adminCalculateResult({ testid: testId }).subscribe((resp: Response) => {
      const data = resp;
      this.loaderService.appLoader= false;
      this.testsService.all().subscribe((response: Response) => {
        this.AllTests = response;
       
      });
    });
  }

  showrall = testId => {
    this.router.navigateByUrl('testresults/' + testId);
  }
}
