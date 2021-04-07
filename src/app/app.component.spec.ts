import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentService } from './services';
import { Observable, of } from 'rxjs';
import { Student, Course } from './models';
import { AppComponent } from './app.component';
import { StudentCoursesComponent } from './student-courses/student-courses.component';
import { StudentInfoComponent } from './student-info/student-info.component';
import { StudentListComponent } from './student-list/student-list.component';
import { Server, StudentCoursesDictionary } from './infrastructure/server';

let server: Server;
let students: Student[];
let courses: Course[];
let studentCourses: StudentCoursesDictionary;
let studentToSelect: Student;

class MockStudentService {
    getStudents(): Observable<Student[]> {
        return of(students);
    }

    getStudent(studentEmail: string): Observable<Student> {
        return of(students.find(student => student.email === studentEmail));
    }

    getCourseIdsForStudent(studentEmail: string): Observable<string[]> {
        return of(studentCourses[studentEmail]);
    }

    getCourse(courseId: string): Observable<Course> {
        return of(courses.find(course => course.id === courseId));
    }
}

describe(`AppComponent`, () => {
    const mockStudentService = new MockStudentService();
    let fixture: ComponentFixture<AppComponent>;
    let appComponent: AppComponent;

    let getStudentsSpy: jasmine.Spy;
    let getCourseSpy: jasmine.Spy;
    let getStudentCoursesSpy: jasmine.Spy;

    beforeEach(async(() => {
        server = new Server();
        students = server.getRandomStudents();
        courses = server.getCourses();
        studentCourses = server.getRandomStudentCourseIds(students, courses);
        studentToSelect = students[1];

        TestBed.configureTestingModule({
          declarations: [
            AppComponent,
            StudentListComponent,
            StudentInfoComponent,
            StudentCoursesComponent
          ],
          imports: [
            FormsModule
          ],
          providers: [{ provide: StudentService, useValue: mockStudentService }],
        });
        fixture = TestBed.createComponent(AppComponent);
        appComponent = fixture.debugElement.componentInstance;

        getStudentsSpy = spyOn(mockStudentService, 'getStudents').and.callThrough();
        getCourseSpy = spyOn(mockStudentService, 'getCourse').and.callThrough();
        getStudentCoursesSpy = spyOn(mockStudentService, 'getCourseIdsForStudent').and.callThrough();
    }));

    describe('Functionality', () => {
        it(`should display the complete list of students with first name and last name in the dropdown`, async() => {
            // act
            fixture.detectChanges();
            // assert
            const studentListSelect: HTMLSelectElement = fixture.nativeElement.querySelector('app-student-list select');
            expect(studentListSelect).toBeDefined('Expected the dropdown to be inside student-list component but it was not');

            expect(studentListSelect.children.length).toBeGreaterThanOrEqual(students.length);
            expect(studentListSelect.children.length).toBeLessThanOrEqual(students.length + 1);

            const options: Element[] = Array.from(studentListSelect.children);
            students.forEach(student => {
                    const optionWithStudentName = options.find(option => option.textContent.trim() === `${student.firstName} ${student.lastName}`);
                expect(optionWithStudentName).toBeDefined(`Expected student with name ${student.firstName} ${student.lastName} to be present in the dropdown but it wasn't.`);
            });
        });
        it(`should call getStudents only once`, async() => {
            // act
            fixture.detectChanges();
            // assert
            expect(getStudentsSpy).toHaveBeenCalledTimes(1);
        });

        describe('Selecting a student', () => {
            beforeEach(async() => {
                // arrange
                fixture.detectChanges();
                const studentListSelect: HTMLSelectElement = fixture.nativeElement.querySelector('select');
                const option: HTMLOptionElement = Array.from(studentListSelect.children)
                    .find(child => child.textContent.trim() === `${studentToSelect.firstName} ${studentToSelect.lastName}`) as HTMLOptionElement || undefined;

                // act
                studentListSelect.value = option.value;
                studentListSelect.dispatchEvent(new Event('change'));
                fixture.detectChanges();
            });
            it(`should display the selected student's name, student number, email, and registration date`, async() => {
                // assert
                const studentNameDiv: HTMLElement = fixture.nativeElement.querySelector('app-student-info #student-name-div');
                expect(studentNameDiv).toBeDefined('Expected the student name to be inside student-info component but it was not');
                expect(studentNameDiv.textContent.trim()).toBe(`Name: ${studentToSelect.firstName} ${studentToSelect.lastName}`);

                const studentNumberDiv: HTMLElement = fixture.nativeElement.querySelector('app-student-info #student-number-div');
                expect(studentNumberDiv).toBeDefined('Expected the student number to be inside student-info component but it was not');
                expect(studentNumberDiv.textContent.trim()).toBe(`Student Number: ${studentToSelect.studentNumber}`);

                const studentEmailDiv: HTMLElement = fixture.nativeElement.querySelector('app-student-info #student-email-div');
                expect(studentEmailDiv).toBeDefined('Expected the student email to be inside student-info component but it was not');
                expect(studentEmailDiv.textContent.trim()).toBe(`Email: ${studentToSelect.email}`);

                const studentRegistrationDateDiv: HTMLElement = fixture.nativeElement.querySelector('app-student-info #student-registration-date-div');
                expect(studentRegistrationDateDiv).toBeDefined('Expected the registration date to be inside student-info component but it was not');

                const datePipe = new DatePipe('en');
                const expectedDateFormat = datePipe.transform(studentToSelect.registrationDate, 'longDate');
                expect(studentRegistrationDateDiv.textContent.trim()).toBe(`Registration Date: ${expectedDateFormat}`);
            });
            it(`should display the selected student's courses with the name, instructor, and credits, ignoring exact format`, async() => {
                // arrange
                const studentCoursesList: HTMLUListElement = fixture.nativeElement.querySelector('app-student-courses #student-courses-list');
                const courseIdsForSelectedStudent = studentCourses[studentToSelect.email];
                const listItems = Array.from(studentCoursesList.children) as HTMLLIElement[];

                // assert
                expect(studentCoursesList).toBeDefined('Expected the course list to be inside student-courses component but it was not');

                expect(listItems.length).toEqual(courseIdsForSelectedStudent.length);
                courseIdsForSelectedStudent.forEach(courseId => {
                    const course = courses.find(c => c.id === courseId);
                    const listItemContainingCourse = listItems.find(listItem => listItem.innerText.trim().includes(course.name));
                    
                    expect(listItemContainingCourse).toBeDefined(`Expected a list item for course: ${course.name} but there were none. Items were: ${listItems.map(listItem => listItem.innerText).join(', ')}`);
                    
                    expect(listItemContainingCourse.innerText.includes(course.name)).toBe(true, `Expected the list item to contain course name ${course.name} but it didnt: ${listItemContainingCourse.innerText}`);
                    expect(listItemContainingCourse.innerText.includes(course.instructor)).toBe(true, `Expected the list item to contain course instructor ${course.instructor} but it didnt: ${listItemContainingCourse.innerText}`);
                    expect(listItemContainingCourse.innerText.includes(course.credits.toString())).toBe(true, `Expected the list item to contain course credits ${course.credits} but it didnt: ${listItemContainingCourse.innerText}`);

                });
            });
            it(`should display the selected student's courses with the name, instructor, and credits with the exact format asked`, async() => {
                // arrange
                const studentCoursesList: HTMLUListElement = fixture.nativeElement.querySelector('#student-courses-list');
                const courseIdsForSelectedStudent = studentCourses[studentToSelect.email];
                const listItems = Array.from(studentCoursesList.children) as HTMLLIElement[];

                // assert
                expect(listItems.length).toEqual(courseIdsForSelectedStudent.length);
                courseIdsForSelectedStudent.forEach(courseId => {
                    const course = courses.find(c => c.id === courseId);
                    const expectedCourseText = `${course.name } - ${course.instructor } (${course.credits } credits)`;
                    const listItemContainingCourse = listItems.find(listItem => listItem.innerText.trim() === expectedCourseText);
                    
                    expect(listItemContainingCourse).toBeDefined(`Expected a list item for course with text: ${expectedCourseText} but there were none. Items were: ${listItems.map(listItem => listItem.innerText).join(', ')}`);
                    expect(listItemContainingCourse.innerText.trim()).toEqual(expectedCourseText);
                });
            });
            it(`should display the selected student's courses in alphabetical order by course name`, async() => {
                // arrange
                const courseIdsForSelectedStudent = studentCourses[studentToSelect.email];
                const courseNamesInAlphabeticalOrder = courses.filter(course => courseIdsForSelectedStudent.includes(course.id))
                    .sort((course1: Course, course2: Course) => course1.name.localeCompare(course2.name))
                    .map(course => course.name);

                const studentCoursesList: HTMLUListElement = fixture.nativeElement.querySelector('#student-courses-list');
                const listItems = Array.from(studentCoursesList.children) as HTMLLIElement[];

                // assert
                courseNamesInAlphabeticalOrder.forEach((courseName: string, index: number) => {
                    const courseNameInListAtSameIndex = listItems[index].innerText
                        .trim()
                        .split(' ')
                        [0];
                    expect(courseNameInListAtSameIndex).toEqual(courseName);    
                });
                
                expect(listItems.length).toEqual(courseIdsForSelectedStudent.length);
                courseIdsForSelectedStudent.forEach(courseId => {
                    const course = courses.find(c => c.id === courseId);
                    const expectedCourseText = `${course.name } - ${course.instructor } (${course.credits } credits)`;
                    const listItemContainingCourse = listItems.find(listItem => listItem.innerText.trim() === expectedCourseText);
                    
                    expect(listItemContainingCourse).toBeDefined;
                    expect(listItemContainingCourse.innerText.trim()).toEqual(expectedCourseText);
                });
            });

            it(`should call getCourseIdsForStudent only once`, async() => {
                // assert
                expect(getStudentCoursesSpy).toHaveBeenCalledTimes(1);
            });
            it(`should call getCourse only once per course`, async() => {
                // arrange
                const courseIdsForSelectedStudent = studentCourses[studentToSelect.email];
                // assert
                expect(getCourseSpy).toHaveBeenCalledTimes(courseIdsForSelectedStudent.length);
            });
        });
    });

    describe('Bonus', () => {
        it(`should not display student info when no student is selected`, async() => {
            // act
            fixture.detectChanges();
            // assert
            const studentNameDiv: HTMLElement = fixture.nativeElement.querySelector('#student-name-div');
            expect(studentNameDiv).toBeNull();

            const studentNumberDiv: HTMLElement = fixture.nativeElement.querySelector('#student-number-div');
            expect(studentNumberDiv).toBeNull();

            const studentEmailDiv: HTMLElement = fixture.nativeElement.querySelector('#student-email-div');
            expect(studentEmailDiv).toBeNull();

            const studentRegistrationDateDiv: HTMLElement = fixture.nativeElement.querySelector('#student-registration-date-div');
            expect(studentRegistrationDateDiv).toBeNull();
        });
        it(`should not display student courses list when no student is selected`, async() => {
            // act
            fixture.detectChanges();
            // assert
            const studentCoursesList: HTMLElement = fixture.nativeElement.querySelector('#student-courses-list');
            expect(studentCoursesList).toBeNull();
        });
    });
});