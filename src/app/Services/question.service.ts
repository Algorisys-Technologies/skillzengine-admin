import {CommonService} from './common.service';
import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root'
  })
export class QuestionService {
    constructor(private commonService: CommonService) { }

    createcategory = (category) =>  {
        return this.commonService.post('/Createcategory',
            { group: category.group, name: category.name, password: category.password });
    }

    all =  () => {
        return this.commonService.post('/QAll');
    }

    questionsByCategory =  (categoryId) =>  {
         const obj: any = {};
         if (categoryId === '' || categoryId === 'All' || categoryId === undefined) {
             obj.categoryId = 'All';
         } else {
             obj.categoryId = categoryId;
         }
         return this.commonService.post('/QByCategory', obj);
    }

    getAll =  (userid, testid) =>  {
        return this.commonService.post('/QgetAll', {userid: userid, testid: testid});
    }

    add =  (question) =>  {
        return this.commonService.post('/QAdd', question);
    }

    qUpdate =  (question) =>  {
        return this.commonService.post('/QUpdate', question);
    }

    qDelete =  (question) =>  {
        return this.commonService.post('/QDelete', question);
    }

    getById =  (questId) =>  {
        return this.commonService.post('/QgetById', {id: questId});
    }

     removeFile =  (fileName, uniqueId) =>  {
        return this.commonService.post('/RemoveFile', {'fileName': fileName, 'uniqueId': uniqueId});
    }


    uploadFile(data){
        return this.commonService.post('/UploadFile', data);
    }
}
