import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { Validators, FormBuilder } from '@angular/forms';
import { GroupService } from '../../Services/group.service';
import { CategoryService } from '../../Services/category.service';
import { QuestionService } from '../../Services/question.service';
import { ActivatedRoute } from '@angular/router';
import { TestsService } from '../../Services/tests.service';
import 'rxjs/add/operator/filter';
import { Location } from '@angular/common';
import { LoaderService } from '../../Services/loader.service';
@Component({
  selector: 'app-edittest',
  templateUrl: './edittest.component.html'

})
export class EdittestComponent implements OnInit {

  message = '';
  grpList: any;
  catList: any;
  questions: any;
  selectedQuestions: Array<any> = [];
  origQuestions: any;
  submitted = false;
  mqIds: Array<any> = [];
  catName: string;
  testid: any;
  editData: any;
  isAutoCalcChked: boolean = false;
    
  tblbtns: any[] = [
    {
        title: 'Edit Test',
        keys: ["Id"],
        action: 'edit',
        ishide: false,
        isChkBox:true,
        class:'class="fa fa-fw fa-check'
    }

];

columns: any[] = [
  {label:'Id',name: '_id'}, 
  {label:'Questions',name: 'text'}];

  constructor(

    private fb: FormBuilder,
    private groupService: GroupService,
    private categoryService: CategoryService,
    private questionService: QuestionService,
    private testsService: TestsService,
    private _Activatedroute: ActivatedRoute,
    private _location: Location,
    private loaderService :LoaderService
  ) {
    this.getQuestionList('All');
  }


  ngOnInit() {
    this.isAutoCalcChked = false;
    this.getGroupList();
    this.getCategoryList();
    this._Activatedroute.params.subscribe(params => {
      this.testid = params['_id'];
    });
    this.testForm.controls["id"].setValue(this.testid);
    this.getTestsByID(this.testid);

  }


  testForm = this.fb.group({
    id: [{ value: '', disabled: false }, (Validators.nullValidator)],
    iscalculated: [{ value: '', disabled: false }, (Validators.nullValidator)],
    qIds: [{ value: [], disabled: false }, (Validators.nullValidator)],
    category: [{ value: [], disabled: false }, (Validators.required)],
    testName: [{ value: '', disabled: false }, (Validators.required)],
    testTime: [{ value: '', disabled: false }, (Validators.required)],
    isActive: [{ value: '', disabled: false }, (Validators.nullValidator)],
    isAutoCalc: [{ value: false, disabled: false }, (Validators.nullValidator)],
    isShowResult: [{ value: false, disabled: false }, (Validators.nullValidator)],
    isScreenShare: [{ value: false, disabled: false }, (Validators.nullValidator)],
    isVideoShare: [{ value: false, disabled: false }, (Validators.nullValidator)],
    groupid: [{ value: [], disabled: false }, (Validators.required)],

  });

  get f() { return this.testForm.controls; }

  onSubmit() {

    if (this.selectedQuestions.length == 0) {
      this.message = "Please select questions!";
      this.submitted = false;
      return;
    }
    this.testForm.controls["qIds"].setValue(this.selectedQuestions);
    this.testForm.controls["isActive"].setValue(true);
    this.testForm.controls["iscalculated"].setValue(false);
    let newTime = this.testForm.controls["testTime"].value * 60;
    this.testForm.controls["testTime"].setValue(newTime);
    this.submitted = true;

    if (this.testForm.invalid) {
      return;
    }
    this.edit();
  }



  private edit() {
      this.loaderService.appLoader =true;
    this.testsService.updateTest(this.testForm.getRawValue())
      .subscribe((response: Response) => {
        this.message = "Test updated successfully";
        this.submitted = false;
        this.testForm.reset();
        this.gotoParent();
        this.getQuestionList('All');
        this.loaderService.appLoader = false;
      }, error => {
      });
  }

  populateTestForm(data) {


    this.testForm.controls["qIds"].setValue(data[0]['qIds']);
    this.testForm.controls["category"].setValue(data[0]['category']);
    this.getQuestionList(this.testForm.controls["category"].value);
    this.testForm.controls["testTime"].setValue(data[0]['testTime'] / 60);
    this.testForm.controls["testName"].setValue(data[0]['testName']);
    this.testForm.controls["groupid"].setValue(data[0]['groupid']);
    this.testForm.controls["isAutoCalc"].setValue(data[0]['isAutoCalc']);
    this.testForm.controls["isShowResult"].setValue(data[0]['isShowResult']);
    this.testForm.controls["isScreenShare"].setValue(data[0]['isScreenShare']);
    this.testForm.controls["isVideoShare"].setValue(data[0]['isVideoShare']);
    for (const key of Object.keys(this.testForm.controls["qIds"].value)) {
      this.selectedQuestions.push(this.testForm.controls["qIds"].value[key]);
    }
  }

  getGroupList() {
    this.loaderService.appLoader =true;
    this.groupService.groupListService().subscribe((response: Response) => {
      this.grpList = response;
      this.loaderService.appLoader = false;
    });
  }
  getCategoryList() {
    this.loaderService.appLoader =true;
    this.categoryService.categoryListService().subscribe((response: Response) => {
      this.catList = response;
      this.loaderService.appLoader = false;
    });
  }

  getQuestionList(categoryId: string) {
    this.loaderService.appLoader =true;
    this.questionService.questionsByCategory(categoryId).subscribe((response: Response) => {
      this.questions = response;
      this.origQuestions = response;
      this.loaderService.appLoader = false;
    });
  }
 
  onSelect(obj) {
    if (obj[0].event.target.checked) {
      this.selectedQuestions.push(obj[0].option._id)
    }
    else if (!obj[0].event.target.checked) {
      let newSelectedQuestions = [];
      for (const key of Object.keys(this.selectedQuestions)) {
        if (this.selectedQuestions[key] != obj[0].option._id) {
          newSelectedQuestions.push(this.selectedQuestions[key]);
        }
      }
      if (newSelectedQuestions) {
        this.selectedQuestions = [];
        this.selectedQuestions = newSelectedQuestions;
      }
    }
  }

  


  selecteCategory(values) {
    this.getQuestionList(this.testForm.controls["category"].value);
  }

  getTestsByID(testid: string) {
    this.testsService.getTestById(testid).subscribe((response: Response) => {
      this.editData = response;
      this.populateTestForm(this.editData);

    });
  }


  gotoParent() {
    this._location.back();
  }


}
