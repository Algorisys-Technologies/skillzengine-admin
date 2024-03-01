import { Component, OnInit } from '@angular/core';
import { ResultsService } from '../../Services/results.service';
import { DashboardService } from '../../Services/dashboard.service';
import { LoaderService } from '../../Services/loader.service';
@Component({
  selector: 'app-allresults',
  templateUrl: './allresults.component.html'
})
export class AllresultsComponent implements OnInit {
  allusers: any = [];
  testWiseMarks: any = [];
  userTests: any = [];
  users: any[]
  groups: any[];
  selectedUser: string = '';

  tblbtns: any[] = [
    {
        title: 'Details',
        keys: ['Id'],
        action: 'details',
        ishide: false,
        isChkBox:false,
        isLink:true,
        routeTo:'../testdetails',
        class:''
    }
];


  columns: any[] = [
    {label:'Id',name: '_id'}, 
    {label:'Test Name',name: 'testName'},
    {label:'Marks %',name: 'Marks'}];
    

  constructor(private resultService: ResultsService,
    private dashboardService: DashboardService,
    private loaderService:LoaderService

  ) { }

  ngOnInit() {
    this.groups = [{ 'code': 'user', 'name': 'user' }, { 'code': 'admin', 'name': 'admin' }];
    this.getUserList();
  }

  getUserList() {
      this.loaderService.appLoader = true;
    this.resultService.allUsers().subscribe((response: Response) => {
      this.allusers = response;
      this.selectedUser = this.allusers[0]._id;
      this.loaderService.appLoader = false;
      this.getuserTests();
     
    });
  }

  getTestWiseMarks(testId) {
    this.resultService.getTestWiseMarks({ testId: testId }).subscribe((response: Response) => {
      this.testWiseMarks = response;
    });
  }
  onSelectUser(selUser) {
    this.selectedUser = selUser;
  }

  getuserTests() {
    this.loaderService.appLoader = true;
    if (this.selectedUser) {
      this.dashboardService.getuserTests(this.selectedUser, 'admin').subscribe((response: Response) => {
        this.userTests = response;
        this.loaderService.appLoader = false;
      });
    } else {
      this.loaderService.appLoader = false;
    }
  }
}
