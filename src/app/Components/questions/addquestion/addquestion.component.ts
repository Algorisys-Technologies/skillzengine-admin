import { Component, Input, ViewChild, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormArray, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { QuestionService } from '../../../Services/question.service';
import { LoaderService } from '../../../Services/loader.service';
@Component({
  selector: 'app-addquestion',
  templateUrl: './addquestion.component.html'
})
export class AddquestionComponent implements OnInit {
  
  @Input() queCategories: any = [];
  @Input() questionToEdit: {};
  @Input() pageTitle: string;

  @Output() onCancel = new EventEmitter<boolean>();

  categories: any = [];
  choices: any = [];
  anschoices: any = [];
  questionTypes: any = [];
  boolAnsArr: any = [];
  mcqQueAns: any = [];
  questionType: string = "";
  submitted: boolean = false;
  savedMessage: string = '';
  showMessage: boolean;
  fileToUpload: any[];
  filesArray: any[];
  queitems: FormArray;
  ansitems: FormArray;

  @ViewChild("fileInput") fileInput;

  constructor(private fb: FormBuilder, 
    private questionService: QuestionService,
    private loaderService:LoaderService) { }

  get f() { return this.addQuestionForm.controls; }

  ngOnInit() {
   
    this.categories = this.queCategories;

    this.questionTypes = ['numeric', 'boolean', 'text', 'mcq'];

    this.boolAnsArr = ['True', 'False'];
    if (this.questionToEdit) {
      this.poppulateFormForEdit(this.questionToEdit)
    }
  }

  poppulateFormForEdit(question) {
    this.addQuestionForm.controls["id"].setValue(question._id);
    this.addQuestionForm.controls["qustiontext"].setValue(question.text);
    this.addQuestionForm.controls["answer"].setValue(question.answer);
    this.addQuestionForm.controls["category"].setValue(question.category);
    this.addQuestionForm.controls["queType"].setValue(question.questionType);


    this.questionType = question.questionType;
    this.queitems = this.addQuestionForm.get('queitems') as FormArray;
    this.mcq();
    if (question.questionType === 'mcq') {
      
      console.log(question.answer.constructor.name == "Array");
    
      let ansArray = question.answer.split(',');
      
      if(ansArray.length>1){
        ansArray = ansArray.join();
        ansArray = [ansArray];
      }
      
     
      for (var i = 0; i < question.choice.length; i++) {
        this.queitems = this.addQuestionForm.get('queitems') as FormArray;
        this.queitems.push(this.createQueItem());
        this.queitems.controls[i].get('mcqque').setValue(question.choice[i]);
      }
      for (var i = 0; i < ansArray.length; i++) {
        this.ansitems = this.addQuestionForm.get('ansitems') as FormArray;
        this.ansitems.push(this.createQueItem());
        // this.ansitems.controls[i].get('mcqans').setValue(question.choice[i]);
        this.ansitems.controls[i].get('mcqans').setValue(ansArray[i]); //new changes

      }
    }

    this.filesArray = question.uploadedFileNames && (question.uploadedFileNames === '' ? [] : [question.uploadedFileNames]);
  }

  mcq() {
    this.choices = [];
    this.anschoices = [];
  };

  onTypeChange(val) {
    this.questionType = val;
    if (val === 'mcq') {
      this.createQueItem();
      this.createAnsItem();
    }
  }

  addNewQueChoice() {

    this.submitted = false;
    this.queitems = this.addQuestionForm.get('queitems') as FormArray;
    this.queitems.push(this.createQueItem());
  };

  removeQueChoice(index) {
    this.queitems.removeAt(index)
  }

  addNewAnsChoice = function () {

    this.submitted = false;
    this.ansitems = this.addQuestionForm.get('ansitems') as FormArray;
    this.ansitems.push(this.createAnsItem())
  };

  removeAnsChoice(index) {
    this.ansitems.removeAt(index)
  }

  onSubmit() {
    this.submitted = true;
    if (this.addQuestionForm.invalid) {
      return;
    }

    let formObj = this.addQuestionForm.getRawValue();
    let objQuestion = {};
    if (this.questionType === 'mcq') {
      let arrchoiceQ = [];
      let arrchoiceA = [];
      for (var i = 0; i < formObj.queitems.length; i++) {
        arrchoiceQ.push(formObj.queitems[i].mcqque);
      }
      for (var i = 0; i < formObj.ansitems.length; i++) {
        arrchoiceA.push(formObj.ansitems[i].mcqans);
      }
      objQuestion = {
        category: formObj.category,
        text: formObj.qustiontext,
        questionType: formObj.queType,
        answer: arrchoiceA.toString(),
        uniqueId: '',
        choice: arrchoiceQ,
        id: this.questionToEdit['_id'],
        uploadedFileNames: this.fileToUpload ? this.fileToUpload['name'] : ''
      }
    } else {
      objQuestion = {
        category: formObj.category,
        text: formObj.qustiontext,
        questionType: formObj.queType,
        answer: formObj.answer,
        uniqueId: '',
        id: this.questionToEdit['_id'],
        uploadedFileNames: this.fileToUpload ? this.fileToUpload['name'] : ''
      }
    }
    if (this.questionToEdit['_id'] != '' && this.questionToEdit['_id'] != undefined) {
      this.loaderService.appLoader = true;
      this.questionService.qUpdate(objQuestion).subscribe((response: Response) => {
        this.showMessage = true;
        if (response) {
          this.showMessage = true;
          this.savedMessage = 'Question updated successfully';
          this.loaderService.appLoader =false;
          if (this.fileToUpload) {
            this.uploadFile(this.questionToEdit['_id']);
          }
          if (this.questionType === 'numeric' || this.questionType === 'text') {
            this.addQuestionForm.controls["qustiontext"].setValue('');
            this.addQuestionForm.controls["answer"].setValue('');
          }
          this.submitted = false;
        } else {
          this.showMessage = false;
          this.savedMessage = 'Unable to updated question, try again later';
          this.loaderService.appLoader =false;
        }
      });
    } else {
       this.loaderService.appLoader = true;
      this.questionService.add(objQuestion).subscribe((response: Response) => {
        this.showMessage = true;
        let data: any = response;
        if (data && data['result']) {
          if (this.fileToUpload) {
            this.uploadFile(data.insertedIds[0]);
          }
          this.showMessage = true;
          this.savedMessage = 'Question added successfully';
          this.submitted = false;
          this.loaderService.appLoader =false;
          if (this.questionType === 'numeric' || this.questionType === 'text') {
            this.addQuestionForm.controls["qustiontext"].setValue('');
            this.addQuestionForm.controls["answer"].setValue('');
          }
          if (this.questionType ===  'boolean') {
            this.addQuestionForm.controls["qustiontext"].setValue('');
          }
          if(this.questionType ==='mcq')
          {
            this.addQuestionForm.controls["qustiontext"].setValue('');
            for (var i = 0; i < formObj.queitems.length; i++) {
              this.queitems.removeAt(i)
            }
            this.addQuestionForm.reset();
            this.addQuestionForm.controls["category"].setValue(formObj.category);
            this.addQuestionForm.controls["queType"].setValue(this.questionType);
          }
          
        } else {
          this.showMessage = false;
          this.savedMessage = 'Unable to add question, try again later';
          this.loaderService.appLoader =false;
        }
      });
    }
  }

  cancle() {
    this.onCancel.next(true);
  }

  uploadFile(uniqueId) {

    let formData;
    formData = new FormData();
    var file = this.fileToUpload;
    formData.append('file', file);
    formData.append('filename', file['name']);
    formData.append('uniqueId', uniqueId);

    this.questionService.uploadFile(formData).subscribe((response: Response) => {
    });
  }

  createQueItem(): FormGroup {
    return this.fb.group({
      mcqque: ['', (this.questionType === 'mcq' ? Validators.required : null)],
    });
  }

  createAnsItem(): FormGroup {
    return this.fb.group({
      mcqans: ['', (this.questionType === 'mcq' ? Validators.required : null)],
    });
  }

  onFilesChanged(event) {
    if (event.target.files.length > 0)
      this.fileToUpload = event.target.files[0];
  }

  removeFile(fileName) {
    this.questionService.removeFile(fileName, this.questionToEdit['_id']).subscribe((response: Response) => {
      if (response) {
        this.showMessage = true;
        this.savedMessage = response['message'];

        this.filesArray = [];
      }
    });
  }

  addQuestionForm = this.fb.group({

    id: ['', (this.questionToEdit ? Validators.required : null)],
    qustiontext: ['', ([Validators.required])],
    answer: ['',],
    queType: ['', (Validators.required)],
    category: ['', (Validators.required)],
    files: [null],
    queitems: this.fb.array([this.createQueItem()]),
    ansitems: this.fb.array([this.createAnsItem()])
  });


}
