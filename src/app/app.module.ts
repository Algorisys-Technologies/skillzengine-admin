import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";
import { FormsModule } from "@angular/forms";
import { AppRoutingModule } from "./app-routing.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FilterPipe } from "./Components/dashboard/filter.pipe";
import { AppComponent } from "./app.component";
import { DashboardComponent } from "./Components/dashboard/dashboard.component";
import { CurrentWeekComponent } from "./Components/dashboard/current-week/current-week.component";
import { LiveTestComponent } from "./Components/dashboard/live-test/live-test.component";
import { HeaderComponent } from "./Components/header/header.component";
import { TodayComponent } from "./Components/dashboard/today/today.component";
import { TotalTestsComponent } from "./Components/dashboard/total-tests/total-tests.component";
import { LoginComponent } from "./Components/login/login.component";

import { CommonService } from "./Services/common.service";
import { LoginService } from "./Services/login.service";
import { UserService } from "./Services/user.service";
import { DashboardService } from "./Services/dashboard.service";
import { AnswerService } from "./Services/answer.service";
import { AssignedTestService } from "./Services/assignedtest.service";
import { CategoryService } from "./Services/category.service";
import { GroupService } from "./Services/group.service";
import { InstructionService } from "./Services/instruction.service";
import { QuestionService } from "./Services/question.service";
import { ResultsService } from "./Services/results.service";
import { TestsService } from "./Services/tests.service";
import { UserComponent } from "./Components/user/user.component";
import { ReactiveFormsModule } from "@angular/forms";
import { InstructionsComponent } from "./Components/instructions/instructions.component";
import { TestwiseresultsComponent } from "./Components/testwiseresults/testwiseresults.component";
import { AssigntestComponent } from "./Components/assigntest/assigntest.component";
import { CreatetestComponent } from "./Components/createtest/createtest.component";
import { ChangepasswordComponent } from "./Components/user/changepassword/changepassword.component";
import { AllresultsComponent } from "./Components/allresults/allresults.component";
import { TestdetailsComponent } from "./Components/testdetails/testdetails.component";

import { GroupmastrComponent } from "./Components/groupmastr/groupmastr.component";
import { AllquestionsComponent } from "./Components/questions/allquestions/allquestions.component";

import { AddquestionComponent } from "./Components/questions/addquestion/addquestion.component";
import { UserwiseresultsComponent } from "./Components/userwiseresults/userwiseresults.component";
import { ForgotpassComponent } from "./Components/login/forgotpass.component";
import { ShowtestComponent } from "./Components/showtest/showtest.component";
import { EdittestComponent } from "./Components/showtest/edittest.component";
import { CreatecategoryComponent } from "./Components/createcategory/createcategory.component";
import { TestresultsComponent } from "./Components/dashboard/testresults/testresults.component";

import { ConfirmationDialogService } from "./Components/confirmationdialog/confirmation-dialog.service";
import { ConfirmationDialogComponent } from "./Components/confirmationdialog/confirmationdialog.component";
import { NotificationsComponent } from "./Components/dashboard/notifications/notifications.component";
import { ResetpassComponent } from "./Components/login/resetpass/resetpass.component";
import { InfiniteScrollerDirective } from "./directives/infinte-scroller.directive";
import { DatatableComponent } from "./Components/datatable/datatable.component";
import { LoaderService } from "./Services/loader.service";

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CurrentWeekComponent,
    LiveTestComponent,
    HeaderComponent,
    TodayComponent,
    TotalTestsComponent,
    LoginComponent,
    UserComponent,
    InstructionsComponent,
    TestwiseresultsComponent,
    AssigntestComponent,
    CreatetestComponent,
    ChangepasswordComponent,
    AllresultsComponent,
    TestdetailsComponent,
    GroupmastrComponent,
    AllquestionsComponent,
    ConfirmationDialogComponent,
    AddquestionComponent,
    UserwiseresultsComponent,
    ForgotpassComponent,
    ShowtestComponent,
    EdittestComponent,
    CreatecategoryComponent,
    TestresultsComponent,
    NotificationsComponent,
    FilterPipe,
    ResetpassComponent,
    InfiniteScrollerDirective,
    DatatableComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
  ],
  providers: [
    CommonService,
    LoginService,
    UserService,
    DashboardService,
    AnswerService,
    AssignedTestService,
    CategoryService,
    GroupService,
    InstructionService,
    QuestionService,
    ResultsService,
    TestsService,
    ConfirmationDialogService,
    LoaderService,
  ],
  entryComponents: [ConfirmationDialogComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
