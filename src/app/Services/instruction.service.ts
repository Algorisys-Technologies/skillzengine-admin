import {CommonService} from './common.service';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
@Injectable({
    providedIn: 'root'
  })
export class InstructionService {
    constructor(private commonService: CommonService,private fb: FormBuilder) { }

    insertInstructions = (txt) => {
        return this.commonService.post('/InsertInstructions', {'text': txt});
    }

    getInstructions = () => {
        return this.commonService.post('/GetInstructions');
    }

    removeInstructions = (insId) => {
        return this.commonService.post('/RemoveInstructions', {'_id': insId});
    }

    instructions = this.fb.group({
        text:[{value:'',disabled : false},(Validators.required)],
      });
}
