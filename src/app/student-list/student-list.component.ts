import { Component } from '@angular/core';
import { Course } from '../models/course';
import { Student } from '../models/student';
import { StudentService } from '../services/student.service';

import { map } from 'rxjs/operators';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent {
  students: Student[] = [];
  selectedStudent: Student;
  courseIds: string[];
  courses: Course[];

  constructor(
    private studentService: StudentService
  ) { }

  ngOnInit() {
    this.studentService.getStudents()
      .subscribe(students => {
        console.log(students);
        this.students = students;
      })
  }

  selectStudent(email) {
    this.studentService.getStudent(email)
      .subscribe((student: Student) => {
        console.log('student from getStudent', student);
        if (student) {
          this.selectedStudent = student;
          this.getStudentCourses(student.email);
        }
      })
  }
  getStudentCourses(email) {
    this.courses = [];
    this.studentService.getCourseIdsForStudent(email)
      .pipe(
        map(
          courseIds => courseIds.map(courseId => {
            return this.studentService.getCourse(courseId)
          })
        )
      ).subscribe(courses => {
        courses.forEach(course => {
          course.subscribe(courseDetails => this.courses.push(courseDetails))
        })
      })
  }

}