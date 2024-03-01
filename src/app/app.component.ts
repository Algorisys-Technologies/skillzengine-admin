import { Component } from '@angular/core';
import { LoaderService } from './Services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
   
  constructor(public loaderService: LoaderService) {
      this.loaderService.appLoader= false;
  }
 
  
}
