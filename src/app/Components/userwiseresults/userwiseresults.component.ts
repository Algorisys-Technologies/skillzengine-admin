import { Component, OnInit } from '@angular/core';
import { ResultsService } from '../../Services/results.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-userwiseresults',
  templateUrl: './userwiseresults.component.html'
})
export class UserwiseresultsComponent implements OnInit {

 

  constructor(private router: Router, private route: ActivatedRoute, private resultsService: ResultsService) { }
  testId: string = '';
  userId: string = '';
  resultData: any = [];
  isVisible: boolean = false;

  ngOnInit() {
    this.testId = this.route.snapshot.paramMap.get("testid");
    this.getTestWiseMarks();
  }

  onSelectUser(selUser) {
    this.userId = selUser;
  }
  getTestWiseMarks() {
    this.resultsService.getTestWiseMarks(this.testId).subscribe((response: Response) => {
      this.resultData = response
    });
  }

  showResults() {
    this.resultsService.getUserWiseMarks({ testId: this.testId, userId: this.userId }).subscribe((response: Response) => {
      this.resultData = response;
      this.isVisible = true;
    });
  }

  details(testId, userId) {
    var obj = { testId: testId, userId: userId };
    this.router.navigateByUrl('testdetails/' + testId + '/' + userId);
  }
}
