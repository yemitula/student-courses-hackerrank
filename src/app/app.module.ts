import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { StudentService } from './services/student.service';
import { Server } from './infrastructure/server';
import { StudentInfoComponent } from './student-info/student-info.component';
import { StudentListComponent } from './student-list/student-list.component';
import { StudentCoursesComponent } from './student-courses/student-courses.component';

@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent, StudentInfoComponent, StudentListComponent, StudentCoursesComponent ],
  bootstrap:    [ AppComponent ],
  providers: [ StudentService, Server ]
})
export class AppModule { }
