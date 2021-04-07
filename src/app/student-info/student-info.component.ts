import { Component, Input } from '@angular/core';
import { Course, Student } from '../models';

@Component({
  selector: 'app-student-info',
  templateUrl: './student-info.component.html',
  styleUrls: ['./student-info.component.css']
})
export class StudentInfoComponent {

  @Input() student: Student;
  @Input() courses: Course[];

  constructor(
  ) {

  }

  ngOnInit() {
    this.courses.sort((a, b) => a.name.localeCompare(b.name));
  }
}