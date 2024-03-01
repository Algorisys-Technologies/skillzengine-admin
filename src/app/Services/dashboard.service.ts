import {CommonService} from './common.service';
import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';
@Injectable({
    providedIn: 'root'
  })
export class DashboardService {

    
    totCTest = 0;
    totPTest = 0;
    totCPTest :any;
  constructor(private commonService: CommonService,) { }

    getMyTests = (userId, role) => {
        let tfilter: any = { 'userId': userId, 'issubmit': false };
        if (role === 'admin') {
            tfilter = { 'userId': userId };
        }
        return this.commonService.post('/GetMyTests', tfilter);
    }

    getuserTests = (userId, role) => {
        let tfilter: any = { 'userId': userId };
        if (role === 'admin') {
            tfilter = { 'userId': userId };
        }
        return this.commonService.post('/GetUserTests', tfilter);
    }


    getalluserTests = () => {
        return this.commonService.post('/GetAllUserTests');
    }

    getCalculateTests = (obj) => {
        return this.commonService.post('/GetCalculateTests', obj);
    }

    getAllAnsGetByTestId = (obj) => {
        return this.commonService.post('/GetAllAnsGetByTestId', obj);
    }

    adminCalculateResult = (obj) => {
        return this.commonService.post('/AdminCalculateResult', obj);
    }

    getTodaysGivenTests = () => {
        return this.commonService.post('/GetTodaysGivenTests');
    }

    getRetestNotifications = () => {
        return this.commonService.post('/GetRetestNotifications');
    }

    updateRetestNotifications = (obj) => {
        return this.commonService.post('/UpdateRetestNotifications', obj);
    }

 
    CPTotal(tests){
        this.totPTest =0;
        this.totCTest =0;
        const currDate: any = formatDate(new Date(), 'yyyy-MM-dd', 'en');
        let dbDate = '';
        const wtestlist = [];
        const todaystest = [];
        let blnTestFound = false;
        for (let i = 0; i < tests.length; i++) {
            if (tests[i].issubmitdate) {
                dbDate = tests[i].issubmitdate.split('T');
                dbDate = dbDate[0];
            }

            const dateTime: any = new Date();
            const curMonth = dateTime.getMonth();
            const curYear = dateTime.getFullYear();
            const onejan: any = new Date(curYear, 0, 1);
            const curWeekNumber = Math.ceil((((dateTime - onejan) / 86400000) + onejan.getDay() + 1) / 7);
            const selectedMonth = new Date(dbDate).getMonth();
            const selectedYear = new Date(dbDate).getFullYear();
            const selectedDateTime: any = new Date(dbDate);
            const selectedWeekNumber = Math.ceil((((selectedDateTime - onejan) / 86400000) + onejan.getDay() + 1) / 7);
            if (selectedWeekNumber === curWeekNumber && selectedMonth === curMonth && selectedYear === curYear) {
                const weekTests: any = {};
                weekTests.testName = tests[i].testName;
                weekTests.testId = tests[i].testId;
                weekTests.category = tests[i].category;
                blnTestFound = false;
                for (let j = 0; j < wtestlist.length; j++) {
                    if (wtestlist[j].testName === weekTests.testName) {
                        blnTestFound = true;
                    }
                }
                if (blnTestFound === false) {
                    wtestlist.push(weekTests);
                    this.totCTest = +this.totCTest + 1;
                }
            }

            if (tests[i].issubmit === true && currDate === dbDate) {
                todaystest.push(tests[i]);
                this.totPTest = this.totPTest + 1;
            }
        }
        const todaytestlist = todaystest;
        return {CTest:this.totCTest,PTest:this.totPTest}
    }



}
