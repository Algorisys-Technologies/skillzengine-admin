import { Component, OnInit } from '@angular/core';
import { UserService } from '../../Services/user.service';
import { Response } from '@angular/http';
import { FormGroup } from '@angular/forms';

import { ConfirmationDialogService } from '../confirmationdialog/confirmation-dialog.service';
import { LoaderService } from '../../Services/loader.service';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html'

})
export class UserComponent implements OnInit {
  filteredData: any;
  userList: any = [];
  masterList = true;
  master = false;
  multipleUser = false;
  Message = '';
  delMessage = '';
  error1 = '';
  errList: any = [];
  groups: any = [];
  submitted = false;
  mode = 'Create';
  title = 'Create user';
  isMultiple = false;
  duplicateMails: any = [];
  duplicateMailsFound: boolean = false;
  amailNames: any = [];
  
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
    {label:'User Name',name: 'name'},
    {label:'User Type',name: 'group'}];

    message ='';
     
  constructor(private userService: UserService, 
    private confirmationDialogService: ConfirmationDialogService,
    private loaderService:LoaderService
    ) {


  }
  userForm: FormGroup = this.userService.user;

  userData: {};
  buttonCaption = 'Create';

  ngOnInit() {

    this.userForm.reset();
    this.groups = [{ 'code': 'User', 'name': 'User' }, { 'code': 'Admin', 'name': 'Admin' }];
    this.getUserList();
    
    
  }

  get f() { return this.userForm.controls; }

  getUserList() {
    this.loaderService.appLoader = true;
    this.userService.userListService().subscribe((response: Response) => {
      this.userList = response;
      this.filteredData= response;
      this.loaderService.appLoader = false;
    });
  }

  populateUserForm(data) {

    this.userForm.controls["id"].setValue(data[0]['_id']);
    this.userForm.controls["name"].setValue(data[0]['name']);
    this.userForm.controls["password"].setValue(data[0]['password']);

    let userGroup = data[0]['group'][0].toUpperCase() + data[0]['group'].slice(1);

    this.userForm.controls["group"].setValue(userGroup);
    this.userForm.controls["isActive"].setValue(data[0]['isActive']);
  }

  onEdit(obj) {
    this.title = 'Edit User';
    this.master = true;
    this.masterList = false;
    this.multipleUser = false;
    this.buttonCaption = 'Update';
    this.userForm.get('group').enable();
    this.loaderService.appLoader = true;
    this.userService.getByUsersName(obj.name)
      .subscribe(
        data => {
          this.userData = data;
          this.populateUserForm(this.userData);
          this.mode = 'Edit';
          this.userForm.get('password').disable();
          this.loaderService.appLoader = false;
        },
        error => { 
          this.loaderService.appLoader = false;
        }
      )
  }

  addUser() {

    this.error1 = '';
    this.errList = [];
    this.duplicateMailsFound = false;
    this.duplicateMails = [];
    this.submitted = false;
    this.isMultiple = false;
    this.userForm.get('password').enable();
    this.userForm.reset();

    this.userForm.get('group').enable();
    this.userForm.get('isActive').enable();
    this.master = true;
    this.masterList = false;
    this.multipleUser = false;
    this.multipleUser = false;
    this.mode = 'Create';
    this.title = 'Create user';
    this.buttonCaption = 'Save';

  }

  addMultipleUser() {
    this.submitted = false;
    this.error1 = '';
    this.errList = [];
    this.duplicateMailsFound = false;
    this.duplicateMails = [];
    this.isMultiple = true;
    this.userForm.get('password').enable();
    this.userForm.reset();
    this.userForm.controls["group"].setValue("User");
    this.userForm.controls["isActive"].setValue(true);
    this.userForm.get('isActive').disable();
    this.userForm.get('group').disable();
    this.master = false;
    this.masterList = false;
    this.multipleUser = true;
    this.master = false;
    this.mode = 'Create';
    this.title = 'Create multiple users';
    this.buttonCaption = 'Save';

  }

  onSubmit() {
    this.submitted = true;
    if (this.mode == "Create") {
      if (this.userForm.invalid) {
        return;
      }
    }
    if (this.mode == "Create") {
      this.create();
    }
    else if (this.mode == "Edit") {
      this.edit();
    }
  }


  onSubmitMultiple() {
    this.submitted = true;
    if (this.mode == "Create") {
      if (!this.isMultiple) {
        if (this.userForm.invalid) {
          return;
        }
      }
      else if (this.isMultiple) {
        var that = this;
        that.error1 = '';
        that.errList = [];
        this.amailNames = [];
        let validEmails = this.userForm.getRawValue();
        if (validEmails.name) {
          this.amailNames = validEmails.name.split(';');
        }
        else if (!validEmails.name) {
          return;
        }
        if (this.amailNames.length > 25) {
          that.error1 = "Only 25 users are allowed";
          return;
        }
        for (let amailnames of this.amailNames) {
          if (this.checkEmails(amailnames)) {
          } else {
            that.errList.push(amailnames);
          }
        }
        if (that.errList && that.errList.length > 0) {
          that.error1 = "Invalid email IDs : " + that.errList;
          return;
        }
        this.removeDuplicateFromList(this.amailNames);
        if (that.duplicateMailsFound) {
          that.error1 = "Duplicate email Ids found in the list : " + that.duplicateMails;
          return;
        }


      }
    }
    if (this.mode == "Create") {
      this.create();
    }
  }





  private edit() {
    this.loaderService.appLoader = true;
    this.userService.editUser(this.userForm.getRawValue())
      .subscribe((response: Response) => {
        this.Message = "Record updated successfully";
        this.submitted = false;
        this.userForm.reset();
        this.loaderService.appLoader = false;
      }, error => {
        this.error1 = "Record not updated";
        this.loaderService.appLoader = false;
      });
  }
   

  private create() {
    this.error1 = '';
    this.Message = '';
    if (!this.isMultiple) {
        this.loaderService.appLoader = true;
      let newObject = this.userForm.getRawValue();
      delete newObject.id;
      let blnDuplicate = false;
      const usrname = this.userForm.controls["name"].value;
      this.userService.getByUsersName(usrname).subscribe((response) => {
        const data: any = response;
        if (data.length > 0) {
          blnDuplicate = true;
        }
        if (blnDuplicate === true) {
            this.error1 = 'Duplicate username found !!';
            this.loaderService.appLoader =false;
        } else {
          this.userService.createUser(newObject).subscribe((response: Response) => {
            this.Message = "Record created successfully";
            this.submitted = false;
            this.loaderService.appLoader =false;
            this.userForm.reset();
          }, error => {
            this.loaderService.appLoader =false;
          });
        }
      });
    }
    else if (this.isMultiple) {
      this.loaderService.appLoader = true;
      let newObject = this.userForm.getRawValue();
      delete newObject.id;
      let blnDuplicate = false;
      this.userService.getByMultipleUsersName(this.amailNames).subscribe((response) => {
        const data: any = response;
        if (data.length > 0) {
          blnDuplicate = true;
        }
        if (blnDuplicate === true) {
          this.checkUserFromServer(this.amailNames, this.userList);
          let unique = this.duplicateMails.filter((v, i, a) => a.indexOf(v) === i);
          this.error1 = 'User names already created!!  ' + unique;
          this.loaderService.appLoader =false;
          return;
        } else {
          this.userService.createMultipleUser(newObject)
            .subscribe((response: Response) => {
              this.Message = "Record created successfully";
              this.loaderService.appLoader =false;
              this.submitted = false;
              this.duplicateMailsFound = false;
              this.userForm.reset();
              this.userForm.controls["group"].setValue("User");
              this.userForm.controls["isActive"].setValue(true);
              this.userForm.get('isActive').disable();
              this.userForm.get('group').disable();
            }, error => {
              this.loaderService.appLoader =false;
            });
        }
      });
    }
  }

   
  onDelete(obj) {
    this.loaderService.appLoader = true;
    this.confirmationDialogService.confirm('Please confirm..', 'Do you wish to delete the selected record ?', true)
      .then((confirmed) => {
        if (confirmed) {
          this.userService.deleteUserByName(obj.name)
            .subscribe((response: Response) => {
              if (typeof(response) === 'string') {
                this.confirmationDialogService.confirm('Cannot delete..', response, false);
              } else {
                this.getUserList();
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

  goBack() {
    this.Message = "";
    this.delMessage = "";
    this.master = false;
    this.masterList = true;
    this.multipleUser = false;
    this.getUserList();
  }


  checkEmails(email) {
    var regExp = /(^[a-z]([a-z_\.]*)@([a-z_\.]*)([.][a-z]{3})$)|(^[a-z]([a-z_\.]*)@([a-z_\.]*)(\.[a-z]{3})(\.[a-z]{2})*$)/i;
    return regExp.test(email);
  }

  removeDuplicateFromList(arr) {
    this.duplicateMailsFound = false;
    var sorted_arr = arr.slice().sort();
    this.duplicateMails = [];
    for (var i = 0; i < sorted_arr.length - 1; i++) {
      if (sorted_arr[i + 1] == sorted_arr[i]) {
        this.duplicateMails.push(sorted_arr[i]);
        this.duplicateMailsFound = true;
      }
    }
  }

  checkUserFromServer(arr, usrlst) {

    this.duplicateMails = [];
    this.duplicateMailsFound = false;
    var that = this;
    for (var i = 0; i < arr.length; i++) {
      arr[i]
      for (const usrList of usrlst) {
        if (usrList.name == arr[i]) {
          this.duplicateMails.push(usrList.name);
          this.duplicateMailsFound = true;
        }
      }
    }

  }
}


