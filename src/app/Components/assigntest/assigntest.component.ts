import { Component, OnInit } from '@angular/core';
import { AssignedTestService } from '../../Services/assignedtest.service';
import { Response } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { GroupService } from '../../Services/group.service';
import { TestsService } from '../../Services/tests.service';
import { UserService } from '../../Services/user.service';
import { LoaderService } from '../../Services/loader.service';

@Component({
  selector: 'app-assigntest',
  templateUrl: './assigntest.component.html'

})
export class AssigntestComponent implements OnInit {
  grpList: any;
  tests: any;
  users: any;
  userLists: any;
  showMessage: boolean;
  submitted = false;
  message = '';
  userSelectionIds: Array<any> = [];
  userSelections: any;
  selectedUsers: Array<any> = [];
  selectedTestName = '';
  selectedCategory = '';
  formValue: Array<any> = [];
  currentDate: Date = new Date();
  mailData: any;
  testTime = 0;
   

   
  tblbtns: any[] = [
    {
        title: 'select',
        keys: ["Id"],
        action: 'select',
        ishide: false,
        isChkBox:true,
        class:'class="fa fa-fw fa-check'
    }

];

  columns: any[] = [
    {label:'Id',name: '_id'}, 
    {label:'User Name',name: 'name'}];

  filteredData: any;
   

  constructor(private assignedTestService: AssignedTestService,
    private groupService: GroupService,
    private testsService: TestsService, private userService: UserService,
    private loaderService :LoaderService
    ) { }
  assignTestForm: FormGroup = this.assignedTestService.assigntest;

  ngOnInit() {
    this.assignTestForm.reset();
    this.getUserList();
    this.getGroupList();
    this.getTests('All');
    var today = new Date().toISOString().split('T')[0];
    document.getElementsByName("startDate")[0].setAttribute('min', today);
    document.getElementsByName("endDate")[0].setAttribute('min', today);

     
  }

  get f() { return this.assignTestForm.controls; }

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
      this.tests = response;
      this.loaderService.appLoader = false;
    });
  }

  getUserList() {
    this.loaderService.appLoader = true;
    this.userService.userListService().subscribe((response: Response) => {
      this.userLists = response;
      this.users = this.userLists.filter(a => a.group == 'user' || a.group == 'User');
      this.filteredData = this.users;
      this.loaderService.appLoader = false;
    });
  }


  onSubmit() {

    let sysdate = this.assignedTestService.convertToDateFormat(this.currentDate);
    if (sysdate > this.assignTestForm.controls["endDate"].value) {
      this.message = "Test is already done";
      this.showMessage = false;
      this.submitted = false;
      return;
    }


    if (this.assignTestForm.controls["startDate"].value > this.assignTestForm.controls["endDate"].value) {
      this.message = "Start date can't be greater than end date";
      this.showMessage = false;
      this.submitted = false;
      return;
    }
    else {
      this.message = "";
    }
    this.submitted = true;
    if (this.assignTestForm.invalid) {
      return;
    }
    this.create();
  }



  private create() {
    this.formValue = [];

    if (this.selectedUsers.length == 0) {
      this.message = "Please select user!";
      this.showMessage = false;
      this.submitted = false;
      return;
    }
    if (this.selectedUsers) {
      
      let NewUsers = this.selectedUsers.filter(a => a.new == true);
      this.mailData = this.selectedUsers.filter(a => a.new == true);
      for (const key of Object.keys(NewUsers)) {

        this.assignTestForm.controls["testName"].setValue(this.selectedTestName);
        this.assignTestForm.controls["category"].setValue(this.selectedCategory);
        this.assignTestForm.controls["timeTaken"].setValue(this.testTime);
        this.assignTestForm.controls["userId"].setValue(NewUsers[key]['userId']);
        this.assignTestForm.controls["userName"].setValue(NewUsers[key]['userName']);
        if (this.assignTestForm.controls["issubmit"].value == false && key == '0') {
          this.assignTestForm.controls["issubmit"].setValue(false);
          this.formValue.push(this.assignTestForm.value);
          break;
        }
        else {
          this.assignTestForm.controls["issubmit"].setValue(false);
          this.assignTestForm.controls["isStarted"].setValue(false);

          this.formValue.push(this.assignTestForm.value);

        }
      }
      if (this.formValue.length > 0) {
        this.loaderService.appLoader = true;
        this.assignedTestService.assignTests(this.formValue)
          .subscribe((response: Response) => {
            this.message = "Test assigned successfully";
            this.showMessage = true;
            this.submitted = false;
            this.loaderService.appLoader = false;
            this.userSelections = 0;
            this.getUserList();
            this.assignTestForm.reset();
            for (const key of Object.keys(NewUsers)) {
              this.userService.assignedTestMail(NewUsers[key]['userId'], this.selectedTestName).subscribe(
                (response: Response) => {
                });
            }
          }, error => {
            this.loaderService.appLoader = false;
          });
      }
      else if (this.formValue.length == 0) {
        this.message = "Test is already assigned!";
        this.showMessage = false;
        this.submitted = false;
        this.loaderService.appLoader = false;
      }
    }
  }


  selecteGroup(values) {
    this.getTests(this.assignTestForm.controls["groupId"].value);
  }

  getTestById() {
    this.setTestName(this.assignTestForm.controls["testId"].value);
    this.assignedTestService.getSelectedUsersforTest(this.assignTestForm.controls["testId"].value).subscribe((response: Response) => {
      this.userSelections = response;
      if (this.userSelections) {
        this.message = "";
      }
      for (const key of Object.keys(this.userSelections)) {
        if (key == '0') {
          this.assignTestForm.controls["testName"].setValue(this.assignedTestService.convertToDateFormat(this.userSelections[key]['testName']));
          this.assignTestForm.controls["startDate"].setValue(this.assignedTestService.convertToDateFormat(this.userSelections[key]['startDate']));
          this.assignTestForm.controls["endDate"].setValue(this.assignedTestService.convertToDateFormat(this.userSelections[key]['endDate']));
          this.assignTestForm.controls["issubmit"].setValue(this.userSelections[key]['issubmit']);
        }
        this.userSelections.push(this.userSelections[key]['userId']);
        this.selectedUsers.push({ userId: this.userSelections[key]['userId'], userName: this.userSelections[key]['userName'], new: false });
      }
    });
  }

  // selecteUser(option, event, index) {
  //  if (event.target.checked) {
  //     this.selectedUsers.push({ userId: option._id, userName: option.name, new: true });
  //   }
  //   else if (!event.target.checked) {
  //     this.selectedUsers.splice(option._id, 1);
  //   }
  // }

  onSelect(obj) {
    if (obj[0].event.target.checked) {
       this.selectedUsers.push({ userId: obj[0].option._id, userName: obj[0].option.name, new: true });
     }
     else if (!obj[0].event.target.checked) {
       this.selectedUsers.splice(obj[0].option._id, 1);
     }
   }

   
  setTestName(value: string) {
    if (this.tests && value) {
      let testFile = this.tests.find(s => s._id == value);
      if (testFile) {
        this.selectedTestName = testFile.testName;
        this.selectedCategory = testFile.category;
        this.testTime = testFile.testTime;
      }

    }
    else {
      this.selectedTestName = '';
      this.selectedCategory = '';
      this.testTime = 0;
    }

  }
}