import {CommonService} from './common.service';
import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root'
  })
export class GroupService {
    constructor(private commonService: CommonService) { }

    creategroup = (group) => {
        return this.commonService.post('/Creategroup', {name: group.name});
    }

    groupListService = () => {
        return this.commonService.post('/GroupList');
    }

    editgroup = group => {
        return this.commonService.post('/Editgroup', { _id: group._id,  name: group.name });
    }

    deletegroup = group => {
        return this.commonService.post('/Deletegroup', { _id: group._id,  name: group.name });
    }
}
