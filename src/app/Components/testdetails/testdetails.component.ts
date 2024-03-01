import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResultsService } from '../../Services/results.service';
import 'rxjs/add/operator/filter';
import { Location } from '@angular/common';
import { ConfirmationDialogService } from '../confirmationdialog/confirmation-dialog.service';
import { TestsService } from '../../Services/tests.service';
import { LoaderService } from '../../Services/loader.service';

@Component({
  selector: 'app-testdetails',
  templateUrl: './testdetails.component.html'
})
export class TestdetailsComponent implements OnInit {
  detailsData: any = [];
  selectedTest: any = [];
  testId: string;
  userId: string;
  testName: string;
  message = '';
  constructor(private resultService: ResultsService,
    private route: ActivatedRoute,
    private _location: Location,
    private testsService: TestsService,
    private confirmationDialogService: ConfirmationDialogService,
    private loaderService : LoaderService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.testId = params['testid'];
      this.userId = params['userid'];
      this.getTestsByID(this.testId);
    });

    this.getDetails();
  }

  getDetails() {
    this.loaderService.appLoader= true;
    this.resultService.getQuestionsAndAnswers({ testId: this.testId, userId: this.userId })
      .subscribe((response: Response) => {
      this.detailsData = response;
      this.loaderService.appLoader=false;
      }, error => {
        this.loaderService.appLoader=false;
    });
  }

  checktext(uansid) {

    for (let i = 0; i < uansid.length; i++) {
      if (uansid[i].iscorrect === true) {
        uansid[i].mark = 1;
      } else {
        uansid[i].mark = 0;
      }
    }
    this.loaderService.appLoader= true;
    this.resultService.updateTextAnswers(uansid)
      .subscribe((response: Response) => {
            this.confirmationDialogService.confirm('', 'User answers reviewed successfully!', false)
          .then((confirmed) => { })
          .catch();
          this.loaderService.appLoader=false;
          this._location.back();
      });
  }

  checktest = function (test, resultView) {
    this.selectedTest.push(test._id);
    if (resultView == 'true') {
      test.iscorrect = true;
    } else {
      test.iscorrect = false;
    }
  };

  gotoParent() {
    this._location.back();
  }


  getTestsByID(testid: string) {
    this.testsService.getTestById(testid).subscribe((response: Response) => {
      let testData = response;
      if (testData) {
        if(testData[0])
        {
          this.testName = testData[0].testName;
        }
        
      } else {
        this.testName = '';
      }
    });
  }

}
