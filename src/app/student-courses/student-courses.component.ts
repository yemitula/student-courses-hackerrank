import { Component, Input } from '@angular/core';
import { Course } from '../models/course';
import { StudentService } from '../services';

@Component({
  selector: 'app-student-courses',
  templateUrl: './student-courses.component.html',
  styleUrls: ['./student-courses.component.css']
})
export class StudentCoursesComponent {
  @Input() courses: Course[];

  constructor(
    private studentService: StudentService
  ) { }

  ngOnInit() {
  }
}
