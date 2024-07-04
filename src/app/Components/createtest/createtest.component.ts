import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { Validators, FormBuilder, FormGroup} from '@angular/forms';
import { GroupService } from '../../Services/group.service';
import { CategoryService } from '../../Services/category.service';
import { QuestionService } from '../../Services/question.service';
import { TestsService } from '../../Services/tests.service';
import { LoaderService } from '../../Services/loader.service';
@Component({
  selector: 'app-createtest',
  templateUrl: './createtest.component.html'
})

export class CreatetestComponent implements OnInit {
  message = '';
  grpList: any;
  catList: any;
  questions: any;
  origQuestions: any;
  submitted = false;
  mqIds: Array<any> = [];
  catName: string;
  showMessage: boolean;
  allCat ='All';
  selCat ='Select Category';

  tblbtns: any[] = [
    {
        title: 'Create Test',
        keys: ["Id"],
        action: 'create',
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
    private loaderService:LoaderService,
  ) {
    // this.getQuestionList('All');
  }

  ngOnInit() {
   
    this.getGroupList();
    this.getCategoryList();
  }

  testForm = this.fb.group({
    iscalculated: [{ value: '', disabled: false }, (Validators.nullValidator)],
    qIds: [{ value: [], disabled: false }, (Validators.nullValidator)],
    category: [{ value: ['Select Category'], disabled: false }, (Validators.required)],
    testName: [{ value: '', disabled: false }, (Validators.required)],
    testTime: [{ value: '15', disabled: false }, (Validators.required)],
    isActive: [{ value: [], disabled: false }, (Validators.nullValidator)],
    isAutoCalc: [{ value: false, disabled: false }, (Validators.nullValidator)],
    isShowResult: [{ value: false, disabled: false }, (Validators.nullValidator)],
    isScreenShare: [{ value: false, disabled: false }, (Validators.nullValidator)],
    isVideoShare: [{ value: false, disabled: false }, (Validators.nullValidator)],
    groupid: [{ value: [], disabled: false }, (Validators.required)],
  });

  get f() { return this.testForm.controls; }

  onSubmit() {

    this.testForm.controls["qIds"].setValue(this.mqIds);
    this.testForm.controls["isActive"].setValue(true);
    this.testForm.controls["iscalculated"].setValue(false);
    let newTime = this.testForm.controls["testTime"].value * 60;
    this.testForm.controls["testTime"].setValue(newTime);
    this.submitted = true;
    if (this.testForm.invalid) {
      return;
    }
    if (this.mqIds.length == 0) {
      this.showMessage = false;
      this.message = "Please select questions!";
      this.submitted = false;
      return;
    }
    this.create();
  }

  private create() {
    this.loaderService.appLoader = true;
    this.testsService.add(this.testForm.getRawValue())
      .subscribe((response: Response) => {
        this.showMessage = true;
        this.message = "Test created successfully";
        this.loaderService.appLoader = false;
        this.mqIds = [];
        this.submitted = false;
        this.testForm.reset();
        this.getQuestionList('All');
      }, error => {
        this.message = "Test not created";
        this.loaderService.appLoader = false;
      });
  }

  getGroupList() {
    this.loaderService.appLoader = true;
    this.groupService.groupListService().subscribe((response: Response) => {
      this.grpList = response;
      this.loaderService.appLoader = false;
    });
  }

  getCategoryList() {
    this.loaderService.appLoader = true;
    this.categoryService.categoryListService().subscribe((response: Response) => {
      this.catList = response;
      this.loaderService.appLoader = false;
    });
  }

  getQuestionList(categoryId: string) {
    this.loaderService.appLoader = true;
    this.questionService.questionsByCategory(categoryId).subscribe((response: Response) => {
      this.questions = response;
      this.origQuestions = response;
      this.loaderService.appLoader = false;
    });
  }

  // selecteQuestion(option, event) {
  //   if (event.target.checked) {
  //     this.mqIds.push(option._id)
  //   }
  // }

  onSelect(obj) {
    if (obj[0].event.target.checked) {
          this.mqIds.push(obj[0].option._id)
        }
   }


  selecteCategory(values) {
    this.getQuestionList(this.testForm.controls["category"].value);
  }
}
