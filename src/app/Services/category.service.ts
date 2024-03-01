import {CommonService} from './common.service';
import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root'
  })
export class CategoryService {
    constructor(private commonService: CommonService) { }

    createcategory = (category) =>  {
        return this.commonService.post('/Createcategory',
            { group: category.group, name: category.name, password: category.password });
    }

    categoryListService = () => {
        return this.commonService.post('/CategoryList');
    }

    editcategory = (category) => {
        return this.commonService.post('/Editcategory',
        { id: category._id, group: category.group, name: category.name, password: category.password } );
    }

    deletecategory = (category)  => {
        return this.commonService.post('/Deletecategory', {id: category.id, name: category.name} );
    }

    deleteCategoryWiseQuestions = (category) => {
        return this.commonService.post('/DeleteCategoryWiseQuestions', category );
    }
}
