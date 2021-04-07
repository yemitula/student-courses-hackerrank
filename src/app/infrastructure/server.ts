import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Student, Course } from '../models';
import { getRandomDate, getRandomFirstName, getRandomLastName, getRandomInt } from './random-helper';
import * as uuid from 'uuid/v4';

export interface StudentCoursesDictionary {
  [studentEmail: string]: string[];
}

const courseNames = ['Algebra', 'Calculus', 'Physics', 'Biology', 'History', 'English', 'Geography', 'Drama', 'Music', 'Art', 'Philosophy'];

@Injectable({
  providedIn: 'root',
})
export class Server {
  private students: Student[];
  private courses: Course[];
  private studentCourses: StudentCoursesDictionary;
  constructor() {
    this.students = this.getRandomStudents();
    this.courses = this.getCourses();
    this.studentCourses = this.getRandomStudentCourseIds(this.students, this.courses);
  }

  getStudents(): Observable<Student[]> {
    return of(this.students);
  }

  getStudent(studentEmail: string): Observable<Student> {
    return of(this.students.find(student => student.email === studentEmail));
  }

  getCourseIdsForStudent(studentEmail: string): Observable<string[]> {
    return of(this.studentCourses[studentEmail] || []);
  }

  getCourse(courseId: string): Observable<Course> {
    return of(this.courses.find(course => course.id === courseId));
  }
  
  getRandomStudents = (): Student[] => {
    const numberOfStudents = getRandomInt(10, 20);
    return Array(numberOfStudents)
      .fill(undefined)
      .map(_ => {
        const firstName = getRandomFirstName();
        const lastName = getRandomLastName();
        return {
          firstName,
          lastName,
          studentNumber: getRandomInt(10000, 1000000),
          email:`${firstName}.${lastName}${getRandomInt(2,20)}@school.com`,
          registrationDate: getRandomDate() 
        };
      });
  }
  
  getRandomStudentCourseIds = (students: Student[], courses: Course[]): StudentCoursesDictionary => students.reduce((StudentCoursesDictionary: StudentCoursesDictionary, student: Student) => {
    StudentCoursesDictionary[student.email] = this.getRandomCourseIds(courses);
    return StudentCoursesDictionary;
  }, {});

  getCourses = (): Course[] => {
      return courseNames.map((courseName: string): Course => ({
      id: uuid(),
      name: courseName,
      instructor: `${getRandomFirstName()} ${getRandomLastName()}`,
      credits: getRandomInt(1, 3)
    }));
  }
  
  private getRandomCourseIds = (courses: Course[]): string[] => {
    const numberOfApplications = getRandomInt(5, courses.length);
    return Array.from(new Set(Array(numberOfApplications)
      .fill(undefined)
      .map(_ => getRandomInt(0, courses.length - 1))))
      .map(uniqueIndex => courses[uniqueIndex].id);
  }
}
