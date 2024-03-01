import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../Services/category.service';
import { Validators, FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';
import { ConfirmationDialogService } from '../confirmationdialog/confirmation-dialog.service';

@Component({
  selector: 'app-createcategory',
  templateUrl: './createcategory.component.html'

})
export class CreatecategoryComponent implements OnInit {
  message = '';
  catList: any;
  submitted = false;
  mode = 'create';
  captionButton = 'Save';
  title = 'Create category';
  master = false;
  filteredData: any;

  isREADONLY: boolean = false;
  tblbtns: any[] = [
    {
        title: 'edit',
        keys: ['Id'],
        action: 'edit',
        ishide: this.isREADONLY,
        isChkBox:false,
        class:'fa fa-edit d-inline-block mr-1'
    },
    {
        title: 'delete',
        keys: ["Id"],
        action: 'delete',
        ishide: this.isREADONLY,
        isChkBox:false,
        class:'fa fa-trash d-inline-block'
    }

];

  columns: any[] = [
    {label:'Id',name: '_id'}, 
    {label:'Category Name',name: 'name'}];

    
     

  constructor(private categoryService: CategoryService,
    private fb: FormBuilder,
    private _location: Location,
    private confirmationDialogService: ConfirmationDialogService
  ) {
  }

  ngOnInit() {
    this.getCategoryList();
    
  }

  catForm = this.fb.group({
    _id: [{ value: '', disabled: false }, (Validators.nullValidator)],
    name: [{ value: '', disabled: false }, (Validators.required)],
  });

  get f() { return this.catForm.controls; }

  onSubmit() {
        this.submitted = true;
    if (this.catForm.invalid) {
      return;
    }
    if (this.mode == 'create') {
      this.create();
    }
    else if (this.mode == 'edit') {
      this.edit();
    }
  }


  addUser(name: string) {
   
    this.catForm.reset();
    this.master = true;
    this.mode = 'create';
    this.captionButton = 'Save';

  }


  private edit() {
    this.categoryService.editcategory(this.catForm.getRawValue())
      .subscribe((response: Response) => {
        this.message = "Category updated successfully";
        this.submitted = false;
        this.catForm.reset();
        this.mode = 'create';
        this.getCategoryList();
      }, error => {
      });
  }

  private create() {
    this.categoryService.createcategory(this.catForm.getRawValue())
      .subscribe((response: Response) => {
        this.message = "Category created successfully";
        this.submitted = false;
        this.catForm.reset();
        this.getCategoryList();
      }, error => {
      });
  }

  populateCatForm(data) {
    this.catForm.controls["_id"].setValue(data._id);
    this.catForm.controls["name"].setValue(data.name);
  }

  createCategory() {
    this.mode = 'create'
    this.captionButton = 'Create'
    this.title = 'Create category'
  }

  onEdit(catData: object) {
    this.master = true;
    this.mode = 'edit'
    this.captionButton = 'Update'
    this.title = 'Edit category'
    this.populateCatForm(catData);

  }

  onDelete(catData: object) {
    this.confirmationDialogService.confirm('Please confirm..', 'Do you really want to delete category ?', true)
      .then((confirmed) => {
        if (confirmed) {
          this.categoryService.deletecategory(catData)
            .subscribe((response: Response) => {
              this.message = "Record deleted successfully";
              this.getCategoryList();
            }, error => {
              
            })
        }
        else {
        }
      }
      )
      .catch();
    this.mode = 'delete'
  }

  getCategoryList() {
    this.categoryService.categoryListService().subscribe((response: Response) => {
      this.catList = response;
      this.filteredData = this.catList;
    });
  }

  gotoParent() {
    this.message = "";
      this.master = false
      this.getCategoryList();
  }
}
