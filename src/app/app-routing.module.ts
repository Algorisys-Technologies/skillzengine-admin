import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { DashboardComponent } from "./Components/dashboard/dashboard.component";
import { CurrentWeekComponent } from "./Components/dashboard/current-week/current-week.component";
import { LiveTestComponent } from "./Components/dashboard/live-test/live-test.component";
import { TodayComponent } from "./Components/dashboard/today/today.component";
import { TotalTestsComponent } from "./Components/dashboard/total-tests/total-tests.component";
import { LoginComponent } from "./Components/login/login.component";
import { ForgotpassComponent } from "./Components/login/forgotpass.component";
import { UserComponent } from "./Components/user/user.component";
import { InstructionsComponent } from "./Components/instructions/instructions.component";
import { TestwiseresultsComponent } from "./Components/testwiseresults/testwiseresults.component";
import { AssigntestComponent } from "./Components/assigntest/assigntest.component";
import { CreatetestComponent } from "./Components/createtest/createtest.component";
import { ChangepasswordComponent } from "./Components/user/changepassword/changepassword.component";
import { AllresultsComponent } from "./Components/allresults/allresults.component";
import { TestdetailsComponent } from "./Components/testdetails/testdetails.component";
import { GroupmastrComponent } from "./Components/groupmastr/groupmastr.component";
import { AllquestionsComponent } from "./Components/questions/allquestions/allquestions.component";
import { UserwiseresultsComponent } from "./Components/userwiseresults/userwiseresults.component";
import { ShowtestComponent } from "./Components/showtest/showtest.component";
import { HeaderComponent } from "./Components/header/header.component";
import { TestresultsComponent } from "./Components/dashboard/testresults/testresults.component";
import { EdittestComponent } from "./Components/showtest/edittest.component";
import { CreatecategoryComponent } from "./Components/createcategory/createcategory.component";
import { NotificationsComponent } from "./Components/dashboard/notifications/notifications.component";
import { ResetpassComponent } from "./Components/login/resetpass/resetpass.component";
import * as GlobalPath from "./globalpath";

const appRoutes: Routes = [
  { path: "", component: LoginComponent },
  { path: "forgotpass", component: ForgotpassComponent },
  { path: "resetpass", component: ResetpassComponent },
  {
    path: "landing",
    component: HeaderComponent,
    children: [
      { path: "dashboard", component: DashboardComponent, outlet: "sidemenu" },
      {
        path: "admintotaltest",
        component: TotalTestsComponent,
        outlet: "sidemenu",
      },
      {
        path: "adminthisweek",
        component: CurrentWeekComponent,
        outlet: "sidemenu",
      },
      {
        path: "livetest",
        component: LiveTestComponent,
        outlet: "sidemenu",
      },
      { path: "admintodaylist", component: TodayComponent, outlet: "sidemenu" },
      {
        path: "notifications",
        component: NotificationsComponent,
        outlet: "sidemenu",
      },
      { path: "user", component: UserComponent, outlet: "sidemenu" },
      {
        path: "instructions",
        component: InstructionsComponent,
        outlet: "sidemenu",
      },
      {
        path: "testwiseresults",
        component: TestwiseresultsComponent,
        outlet: "sidemenu",
      },
      {
        path: "assigntest",
        component: AssigntestComponent,
        outlet: "sidemenu",
      },
      {
        path: "createtest",
        component: CreatetestComponent,
        outlet: "sidemenu",
      },
      {
        path: "changepassword",
        component: ChangepasswordComponent,
        outlet: "sidemenu",
      },
      {
        path: "allresults",
        component: AllresultsComponent,
        outlet: "sidemenu",
      },
      {
        path: "testdetails/:testid/:userid",
        component: TestdetailsComponent,
        outlet: "sidemenu",
      },
      {
        path: "groupmastr",
        component: GroupmastrComponent,
        outlet: "sidemenu",
      },
      {
        path: "allquestions",
        component: AllquestionsComponent,
        outlet: "sidemenu",
      },
      {
        path: "userwiseresults/:testid",
        component: UserwiseresultsComponent,
        outlet: "sidemenu",
      },
      { path: "showtest", component: ShowtestComponent, outlet: "sidemenu" },
      {
        path: "edittest/:_id",
        component: EdittestComponent,
        outlet: "sidemenu",
      },
      {
        path: "createcategory",
        component: CreatecategoryComponent,
        outlet: "sidemenu",
      },
      {
        path: "testresults/:testid",
        component: TestresultsComponent,
        outlet: "sidemenu",
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
