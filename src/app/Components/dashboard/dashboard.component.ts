import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../Services/dashboard.service';
import { TestsService } from '../../Services/tests.service';
import { Response } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { LoaderService } from '../../Services/loader.service';
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

    loginState: any = {};
    totTest = 0;
    totCTest = 0;
    totPTest = 0;
    requestCount = 0;
    totalCPValue:any;
    constructor(private dashboardService: DashboardService,
        private testsService: TestsService,
        private router: Router,
        private route: ActivatedRoute,
        private loaderService:LoaderService
    ) {
        this.loginState = JSON.parse(sessionStorage.getItem('loginState'));
    }

    ngOnInit() {

        let tdata: any = {};
        this.loaderService.appLoader= true;
        this.testsService.all().subscribe((response: Response) => {
            tdata = response;
            this.totTest = tdata.length;
            this.loaderService.appLoader= false;
        });

        this.loaderService.appLoader= true;
        this.dashboardService.getRetestNotifications().subscribe((response: Response) => {
            const requests: any = response;
            this.requestCount = requests.length;
            this.loaderService.appLoader= false;
        });
        
       this.getDashboardAttr();
    }
    getDashboardAttr = () => {
        this.loaderService.appLoader= true;
        this.dashboardService.getTodaysGivenTests().subscribe((response: Response) => {
          const tests: any = response;
          const uniqueTest = tests.filter((thing, index, self) =>
          index === self.findIndex((t) => (
             t.testName === thing.testName
          ))
        )
         var cpTest = this.dashboardService.CPTotal(uniqueTest);
         if(cpTest)
         {
            this.totCTest = cpTest.CTest ;
            this.totPTest = cpTest.PTest ;
         } 
         else {
            this.totCTest =0;
            this.totPTest = 0;
         }
         
      });
      this.loaderService.appLoader= false;
  }

 
}
