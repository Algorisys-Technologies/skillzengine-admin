import { Component, OnInit } from '@angular/core';
import { InstructionService } from '../../Services/instruction.service';
import { Response } from '@angular/http';
import { Validators, FormBuilder } from '@angular/forms';
import { ConfirmationDialogService } from '../confirmationdialog/confirmation-dialog.service';
import { LoaderService } from '../../Services/loader.service';

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html'

})
export class InstructionsComponent implements OnInit {
  allInstructionsList: any = [];
  filteredData :any;
  textValue = '';
  message = '';
  errMessage = '';
  showMessage = false;
  submitted = false;
  
  tblbtns: any[] = [
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
    {label:'Instructions',name: 'text'}];

    
    
  constructor(private instructionService: InstructionService,
    private confirmationDialogService: ConfirmationDialogService,
    private fb: FormBuilder,
    private loaderService :LoaderService) { }

  ngOnInit() {
    this.getAllInstructons();
    
  }

  instrForm = this.fb.group({
    _id: [{ value: '', disabled: false }, (Validators.nullValidator)],
    textValue: [{ value: '', disabled: false }, (Validators.required)],
  });

  get f() { return this.instrForm.controls; }

  addInstructions(): void {
  }

  onSubmit() {
    this.submitted = true;
    if (this.instrForm.invalid) {
      return;
    }
    this.message = '';
    this.create(this.instrForm.controls["textValue"].value);
    this.textValue = '';
  }


  private create(txtValue: string) {
    this.instructionService.insertInstructions(txtValue)
      .subscribe((response: Response) => {
        this.showMessage = true;
        this.message = "Instruction added successsfully!";
        this.submitted = false;
        this.instrForm.controls["textValue"].setValue('');
        this.getAllInstructons();
      }, error => {
      });
  }


  // private deleteUser(id: string) {
  //   this.confirmationDialogService.confirm('Please confirm..', 'Do you really want to delete instruction?', true)
  //     .then((confirmed) => {
  //       if (confirmed) {
  //         this.instructionService.removeInstructions(id)
  //           .subscribe((response: Response) => {
  //             this.getAllInstructons();
  //           }, error => {
  //             this.message = "Not able to delete"
  //           })
  //       }
  //       else {
  //       }
  //     }
  //     )
  //     .catch();
  // }

  onDelete(obj) {
    let id  = obj._id;
    this.loaderService.appLoader= true;
    this.confirmationDialogService.confirm('Please confirm..', 'Do you wish to delete instruction?', true)
      .then((confirmed) => {
        if (confirmed) {
          this.instructionService.removeInstructions(id)
            .subscribe((response: Response) => {
              if (typeof(response) === 'string') {
                this.confirmationDialogService.confirm('Cannot delete..', response, false);
                 this.loaderService.appLoader=false;
              } else {
                this.getAllInstructons();
                this.loaderService.appLoader=false;
              }
            }, error => {
              this.message = 'Unable to delete the selected record!';
              this.loaderService.appLoader=false;
            });
        } else {
          this.loaderService.appLoader=false;
        }
      });

  }

  getAllInstructons() {
    this.loaderService.appLoader= true;
    this.instructionService.getInstructions().subscribe((response: Response) => {
      this.allInstructionsList = response;
      this.filteredData  = this.allInstructionsList; 
      this.loaderService.appLoader=false;
    });
  }

}
