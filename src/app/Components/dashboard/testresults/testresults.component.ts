import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResultsService } from '../../../Services/results.service';
import { Location } from '@angular/common';
import { TestsService } from '../../../Services/tests.service';
import { LoaderService } from '../../../Services/loader.service';
@Component({
  selector: 'app-testresults',
  templateUrl: './testresults.component.html'
})
export class TestresultsComponent implements OnInit {

  testId = '';
  userId = '';
  resultData: any = [];
  resultDataForUser: any = [];
  extractedData: any = [];
  testName: string;
  isVisible = false;


  constructor(private route: ActivatedRoute,
    private resultService: ResultsService,
    private testsService: TestsService,
    private router: Router,
    private _location: Location,
    private loaderService:LoaderService
  ) {
          // this.resultData = undefined;
  }

  ngOnInit() {

    this.route.params.subscribe(params => {
      this.testId = params['testid'];
      this.getTestsByID(this.testId);
    });
    this.GetAllUsers();

  }

  onSelectUser(selUser) {
    this.userId = selUser;
  }


  showResults() {
    if (this.userId == "All") {
      this.loaderService.appLoader = true;
      this.resultService.getTestWiseMarks(this.testId).subscribe((response: Response) => {
        this.resultData = response;
        this.isVisible = true;
        this.loaderService.appLoader = false;
      });
    }
    else if (this.userId != "All") {
      this.loaderService.appLoader = true;
      this.resultService.getUserWiseMarks({ testId: this.testId, userId: this.userId }).subscribe((response: Response) => {
        this.resultData = response;
        this.isVisible = true;
        this.loaderService.appLoader = false;
      });
    }
  }

  details(tId, uId) {
    this.router.navigateByUrl('testdetails/' + tId + '/' + uId);
  }

  GetAllUsers() {
    this.loaderService.appLoader = true;
    this.resultService.getTestWiseMarks(this.testId).subscribe((response: Response) => {
      this.resultDataForUser = response;
      this.isVisible = true;
      this.loaderService.appLoader = false;
    });
  }

  gotoParent() {
    this._location.back();
  }


  getTestsByID(testid: string) {
    this.loaderService.appLoader = true;
    this.testsService.getTestById(testid).subscribe((response: Response) => {
      let testData = response;
      if (testData) {
        this.testName = testData[0].testName;
        this.loaderService.appLoader = false;
      } else {
        this.testName = '';
        this.loaderService.appLoader = false;
      }
    });
  }


}
