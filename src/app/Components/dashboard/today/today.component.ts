import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../Services/dashboard.service';
import { formatDate } from '@angular/common';
 
@Component({
  selector: 'app-today',
  templateUrl: './today.component.html'
})
export class TodayComponent implements OnInit {
  fortest: any = [];
  todaystest: any = [];
  todaytestlist: any = [];
  newTodaytestlist: any = [];
  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    this.dashboardService.getTodaysGivenTests().subscribe((response: Response) => {
      const tests: any = response;
      let dbDate = '';
      const currDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
     
      for (let i = 0; i < tests.length; i++) {
        if (tests[i].issubmitdate) {
          dbDate = tests[i].issubmitdate.split('T');
          dbDate = dbDate[0];
        }

        if (tests[i].issubmit === true && currDate === dbDate) {
          tests[i].expand = false;
          this.todaytestlist.push(tests[i]);
        }
        
      }
          this.newTodaytestlist = this.todaytestlist.filter((thing, index, self) =>
          index === self.findIndex((t) => (
             t.testName === thing.testName
          ))
        )
     
   });
  }
}
