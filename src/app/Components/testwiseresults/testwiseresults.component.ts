import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../Services/group.service';
import { TestsService } from '../../Services/tests.service';
import { ResultsService } from '../../Services/results.service';
import { LoaderService } from '../../Services/loader.service';
@Component({
  selector: 'app-testwiseresults',
  templateUrl: './testwiseresults.component.html'

})
export class TestwiseresultsComponent implements OnInit {
  groupids = '';
  selTest: any;
  grpList: any;
  items: any;
  resultData: any;
  isVisibleStatus: boolean = false;

  tblbtns: any[] = [];
  columns: any[] = [
    {label:'Id',name: '_id'}, 
    {label:'User Name',name: 'userName'},
    {label:'Percentage',name: 'Marks'}];

  constructor(private groupService: GroupService, 
              private testsService: TestsService, 
              private resultsService: ResultsService,
              private loaderService: LoaderService) { }

  ngOnInit() {
    this.getGroupList();
    this.getTests('All');
  }

  getGroupList() {
    this.loaderService.appLoader = true;
    this.groupService.groupListService()
    .subscribe((response: Response) => {
      this.grpList = response;
      this.loaderService.appLoader = false;
    },
      error => { 
      this.loaderService.appLoader = false;
    });
  }

  getTests(groupid: string) {
    this.loaderService.appLoader = true;
    this.testsService.testByGroup(groupid)
    .subscribe((response: Response) => {
        this.items = response;
        this.loaderService.appLoader = false;
        },
        error => { 
          this.loaderService.appLoader = false;
    });
  }

  GetUser() {
    this.getTests(this.groupids);
  }

  isVisible() {
    return this.isVisibleStatus;
  }

  resultshow(testid) {
    this.loaderService.appLoader = true;
    this.resultsService.getTestWiseMarks(testid)
      .subscribe((response: Response) => {
        this.resultData = response;
        this.isVisibleStatus = true;
        this.loaderService.appLoader = false;
      },
        error => { 
          this.loaderService.appLoader = false;
        });
  }
}
