import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../Services/category.service';
import { QuestionService } from '../../../Services/question.service';
import { ConfirmationDialogService } from '../../confirmationdialog/confirmation-dialog.service';
import { ActivatedRoute } from '@angular/router';
import {   FormGroup, FormBuilder } from '@angular/forms';
import { LoaderService } from '../../../Services/loader.service';
@Component({
  selector: 'app-allquestions',
  templateUrl: './allquestions.component.html'
})
export class AllquestionsComponent implements OnInit {
   
  selectForm: FormGroup;
  constructor(private categoryService: CategoryService,
    private questionService: QuestionService,
    private route: ActivatedRoute,
    private confirmationDialogService: ConfirmationDialogService,
    private fb: FormBuilder,
    private loaderService: LoaderService

  ) {  }

  selectedCategory: string = '';
  allQuestions: any = [];
  catWiseQuestions: any = [];
  categories: any = [];
  questionToEdit: {};
  pageTitle: string = "";
  showAddQuestion: boolean = false;
  message = '';
  allCat ='All';
  selCat ='Select Category';
  editCat='';
  category ='';
  
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
    {label:'Questions',name: 'text'},
    {label:'Questions Type',name: 'questionType'}];


  ngOnInit() {
    this.selectForm = this.fb.group({
      selectControl: ['Select Category']
    });
    this.getCategories();
    this.getAllQuestions();
    this.showAddQuestion = false;
    
     
  }

  onSelectCategory(selCat) {
    if(selCat !='Select Category')
    {
        this.selectedCategory = selCat;
        if (selCat != '' && selCat != 'All') {
          this.catWiseQuestions = this.allQuestions.filter(function (que) {
            return que.category === selCat;
          });
        } else {
          this.getQuestions();
        }
  }
  else{
       this.catWiseQuestions=[];
  }
    
  }

  getCategories() {
      this.loaderService.appLoader = true;
      this.categoryService.categoryListService().subscribe((response: Response) => {
      this.categories = response;
      this.loaderService.appLoader = false;
    });
  }

  getQuestions() {
      this.loaderService.appLoader = true;
      this.questionService.all().subscribe((response: Response) => {
      this.catWiseQuestions = this.allQuestions = response;
      this.loaderService.appLoader = false;
    });
  }

  getAllQuestions() {
       this.loaderService.appLoader = true;
       this.questionService.all().subscribe((response: Response) => {
       this.allQuestions = response;
       this.loaderService.appLoader = false;
    });
  }

  getQuestionList(categoryId: string) {
    this.loaderService.appLoader = true;
    this.questionService.questionsByCategory(categoryId).subscribe((response: Response) => {
      this.catWiseQuestions = this.allQuestions = response;
      this.loaderService.appLoader = false;
    });
  }

  
  onEdit(questionToEdit) {
    this.pageTitle = "EDIT QUESTION"
    this.questionToEdit = questionToEdit;
    this.editCat =  questionToEdit.category; 
    this.showAddQuestion = !this.showAddQuestion;
    return false;
  }

  onDelete(obj) {
    this.loaderService.appLoader = true;
    this.confirmationDialogService.confirm('Please confirm..', 'Do you wish to delete the selected record ?', true)
      .then((confirmed) => {
        if (confirmed) {
          this.questionService.qDelete(obj)
            .subscribe((response: Response) => {
              if (typeof(response) === 'string') {
                  this.confirmationDialogService.confirm('Cannot delete..', response, false);
                  this.loaderService.appLoader = false;
              } else {
                // this.getQuestions();
                  this.getQuestionList(this.selectedCategory);
                  this.onSelectCategory(this.selectedCategory);
              }
            }, error => {
                this.message = 'Unable to delete the selected record!';
                this.loaderService.appLoader = false;
            });
        }
        else{
          this.loaderService.appLoader = false;
        }
      });

  }


  toggleAddQuestion(event) {
    this.pageTitle = "ADD QUESTION";
    this.questionToEdit = {};
    this.showAddQuestion = !this.showAddQuestion;
    this.getCategories();
    this.getQuestionList(this.editCat);
    
    return false;
  }
}
