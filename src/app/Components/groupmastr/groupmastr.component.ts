import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../Services/group.service';
import { Validators, FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';
import { ConfirmationDialogService } from '../confirmationdialog/confirmation-dialog.service';

@Component({
  selector: 'app-groupmastr',
  templateUrl: './groupmastr.component.html'

})
export class GroupmastrComponent implements OnInit {
  message = '';
  createMessage = '';
  grpList: any;
  createMaster = false;
  submitted = false;
  mode = '';
  captionButton = '';
  title = '';
  constructor(private groupService: GroupService,
    private fb: FormBuilder,
    private _location: Location,
    private confirmationDialogService: ConfirmationDialogService) {
    this.createMaster = false;
  }

  ngOnInit() {
    this.getGroupList();
  }

  grpForm = this.fb.group({
    _id: [{ value: '', disabled: false }, (Validators.nullValidator)],
    name: [{ value: '', disabled: false }, (Validators.required)],
  });

  get f() { return this.grpForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.grpForm.invalid) {
      return;
    }
    if (this.mode == 'create') {
      this.create();
    }
    else if (this.mode == 'edit') {
      this.edit();
    }
  }

  populategrpForm(data) {
    this.grpForm.controls["_id"].setValue(data._id);
    this.grpForm.controls["name"].setValue(data.name);
  }

  getGroupList() {
    this.groupService.groupListService().subscribe((response: Response) => {
      this.grpList = response;
    });
  }

  showgroupCreateWindow() {
    this.createMaster = true;
    this.mode = 'create'
    this.captionButton = 'Create'
    this.title = 'Create group'

  }

  showgroupEditWindow(grpData: object) {
    this.createMaster = true;
    this.mode = 'edit'
    this.captionButton = 'Update'
    this.title = 'Edit group'
    this.populategrpForm(grpData);
  }

  deletegroup(grpData: object) {
    this.createMaster = true;
    this.mode = 'delete'
  }

  private edit() {
    this.groupService.editgroup(this.grpForm.getRawValue())
      .subscribe((response: Response) => {
        this.createMessage = "Group updated successfully";
        this.submitted = false;
        this.grpForm.reset();
      }, error => {
      });
  }

  private create() {
    this.groupService.creategroup(this.grpForm.getRawValue())
      .subscribe((response: Response) => {
        this.createMessage = "Group created successfully";
        this.submitted = false;
        this.grpForm.reset();
      }, error => {
      });
  }

  private deleteGroup(group: object) {
    this.confirmationDialogService.confirm('Please confirm..', 'Do you really want to delete group ?', true)
      .then((confirmed) => {
        if (confirmed) {
          this.groupService.deletegroup(group)
            .subscribe((response: Response) => {
              this.createMessage = "Record deleted successfully";
              this.getGroupList();
            }, error => {
              this.createMessage = "Not able to delete";
            });
        }
        else {
        }
      }
      )
      .catch();
  }

  goBack() {
    this.message = "";
    this.createMessage = "";
    this.createMaster = false
    this.getGroupList();
  }

  gotoParent() {
    this._location.back();
  }
}
