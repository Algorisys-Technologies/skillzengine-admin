import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../Services/dashboard.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html'
})
export class NotificationsComponent implements OnInit {

  requests: any = [];
  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    this.getNotifications();
  }

  allowRetest = (testid, userid) => {
    const obj: any = {};
    obj.testid = testid;
    obj.userid = userid;
    this.dashboardService.updateRetestNotifications(obj).subscribe((response: Response) => {
      this.getNotifications();
    });
  }

  getNotifications() {
    this.dashboardService.getRetestNotifications().subscribe((response: Response) => {
      this.requests = response;
   
    });
  }

}
