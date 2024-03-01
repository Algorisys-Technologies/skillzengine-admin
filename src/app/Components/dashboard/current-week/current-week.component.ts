import { Component, OnInit } from '@angular/core';
import { TestsService } from '../../../Services/tests.service';
import { DashboardService } from '../../../Services/dashboard.service';
import { Response } from '@angular/http';

@Component({
  selector: 'app-current-week',
  templateUrl: './current-week.component.html'
})
export class CurrentWeekComponent implements OnInit {
  loginState: any = {};
  weektestlist: any = [];
  Message = '';

  constructor(private testsService: TestsService, private dashboardService: DashboardService) {
    this.loginState = JSON.parse(sessionStorage.getItem('loginState'));
  }

  ngOnInit() {
    this.init();
  }
  calculateTestResults = testId => {
    this.dashboardService.adminCalculateResult({ testid: testId }).subscribe((resp: Response) => {
      const data = resp;
      this.init();
    });
  }

  init() {
    this.dashboardService.getTodaysGivenTests().subscribe((response: Response) => {
      const AllTests: any = response;
      let tdata: any = [];
      this.testsService.all().subscribe((resp: Response) => {
        tdata = resp;
        const totTest = tdata.length;
        const currDate: any = new Date('yyyy-MM-dd');
        let dbDate = '';
        const wtestlist = [];
        const todaystest = [];
        let blnTestFound = false;
        for (let i = 0; i < AllTests.length; i++) {
          if (AllTests[i].issubmitdate) {
            dbDate = AllTests[i].issubmitdate.split('T');
            dbDate = dbDate[0];
          }

          const dateTime: any = new Date();
          const curMonth = dateTime.getMonth();
          const curYear = dateTime.getFullYear();
          const onejan: any = new Date(curYear, 0, 1);
          const curWeekNumber = Math.ceil((((dateTime - onejan) / 86400000) + onejan.getDay() + 1) / 7);
          const selectedMonth = new Date(dbDate).getMonth();
          const selectedYear = new Date(dbDate).getFullYear();
          const selectedDateTime: any = new Date(dbDate);
          const selectedWeekNumber = Math.ceil((((selectedDateTime - onejan) / 86400000) + onejan.getDay() + 1) / 7);
          if (selectedWeekNumber === curWeekNumber && selectedMonth === curMonth && selectedYear === curYear) {
            const weekTests: any = {};
            weekTests.testName = AllTests[i].testName;
            weekTests.testId = AllTests[i].testId;
            weekTests.category = AllTests[i].category;
            blnTestFound = false;
            for (let j = 0; j < wtestlist.length; j++) {
              if (wtestlist[j].testName === weekTests.testName) {
                blnTestFound = true;
              }
            }
            if (blnTestFound === false) {
              wtestlist.push(weekTests);
            }
            const wdata = [];
            for (let k = 0; k < totTest; k++) {
              for (let j = 0; j < wtestlist.length; j++) {
                if (tdata[k]._id === wtestlist[j].testId) {
                  wtestlist[j].iscalculated = tdata[k].iscalculated;
                  wdata.push(wtestlist[j]);
                  break;
                }
              }
            }
            this.weektestlist = wdata;

          }
        }
      });

    });
  }
}
