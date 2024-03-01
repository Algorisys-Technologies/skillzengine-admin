
import { GroupService } from '../../Services/group.service';
import { TestsService } from '../../Services/tests.service';
import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { ConfirmationDialogService } from '../confirmationdialog/confirmation-dialog.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoaderService } from '../../Services/loader.service';
@Component({
  selector: 'app-showtest',
  templateUrl: './showtest.component.html'
})
export class ShowtestComponent implements OnInit {
  groupids = '';
  selTest = '';
  grpList: any;
  items: any;
  isVisibleStatus: boolean = false;
  message = '';
  data = '';
  filteredData: any;
  reverse: boolean = false;
  sortCls: string = "fa fa-fw fa-sort";
  searchText: string = '';
  currentPage = 0;
  pageSize = 10;
  isLoadingScroll: boolean = false;
  testPagedSearchResult: any[] = [];
  scrollCallback;
  
  tblbtns: any[] = [
    {
        title: 'edit',
        keys: ['Id'],
        action: 'edit',
        ishide: false,
        isChkBox:false,
        class:'fa fa-edit d-inline-block mr-1'
    },
    {
        title: 'delete',
        keys: ["Id"],
        action: 'delete',
        ishide: false,
        isChkBox:false,
        class:'fa fa-trash d-inline-block'
    }

];
  columns: any[] = [
    {label:'Id',name: '_id'}, 
    {label:'Test Names',name: 'testName'}];
   

  constructor(private groupService: GroupService,
    private testsService: TestsService,
    private confirmationDialogService: ConfirmationDialogService,
    private router: Router,
    private route: ActivatedRoute,
    private loaderService:LoaderService
  ) {
     
  }


  ngOnInit() {
    this.getGroupList();
    this.getTests('All');
    
    
  }

  getGroupList() {
    this.loaderService.appLoader = true;
    this.groupService.groupListService().subscribe((response: Response) => {
      this.grpList = response;
      this.loaderService.appLoader = false;
    });
  }

  getTests(groupid: string) {
    this.loaderService.appLoader = true;
    this.testsService.testByGroup(groupid).subscribe((response: Response) => {
      this.filteredData = response;
      this.loaderService.appLoader = false;
    });
  }

  onEdit(obj) {
    this.router.navigate(['../edittest', obj._id ] ,  { relativeTo: this.route });
  }

  GetUser() {
    this.getTests(this.groupids);
  }

  onDelete(obj) {
    this.loaderService.appLoader = true;
    this.confirmationDialogService.confirm('Please confirm..', 'Do you wish to delete the selected record ?', true)
      .then((confirmed) => {
        if (confirmed) {
          this.testsService.deleteTest(obj)
            .subscribe((response: Response) => {
              if (typeof(response) === 'string') {
                this.confirmationDialogService.confirm('Cannot delete..', response, false);
                this.loaderService.appLoader = false;
              } else {
                   this.getTests('All');
                   this.loaderService.appLoader = false;
              }
            }, error => {
              this.message = 'Unable to delete the selected record!';
              this.loaderService.appLoader = false;
            });
        }
        else {
          this.loaderService.appLoader = false;
        }
      });

  }
 
}



