import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SearchFilter } from '../model/search-filter.model';
import { Project } from '../model/project.model';
import { ApiProjectService } from '../service/api.project-service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ApiUserService } from '../service/api.user-service';
import { User } from '../model/user.model';
import { ProjectRequest } from '../model/project-request.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  addForm: FormGroup;
  searchFilter: SearchFilter = new SearchFilter();
  projectList: Array<Project> = [];
  projectRequest: ProjectRequest = new ProjectRequest();
  existingProject: Project = new Project();
  userList: Array<User> = [];
  manager: User = new User();
  sortingName: string;
  isDesc: boolean;
  closeResult: string;
  submitted = false;
  isEditProject = false;
  isErrorFound = false;
  checkboxValue: boolean;
  errorMessage: string = "No error";
  datePipe: DatePipe = new DatePipe("en-US");

  constructor(private apiProjectService: ApiProjectService, private apiUserService: ApiUserService, private formBuilder: FormBuilder, private modalService: NgbModal) { }

  ngOnInit() {
    let projectEditId = sessionStorage.getItem("projectEditId");

    if (projectEditId) {
      this.apiProjectService.getProjectById(Number(projectEditId)).subscribe(data => {
        this.existingProject = data;

        sessionStorage.removeItem("projectEditId");
        this.isEditProject = true;

        this.setFormValueEditProject();
      });
    }

    this.addForm = this.formBuilder.group({
      project_id: ['', Validators.min(0)],
      project_name: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      priority: ['', Validators.min(1)],
      user_id: ['', Validators.min(0)]
    });

    this.findAllProjects();
  }

  // convenience getter for easy access to form fields
  get formField() { return this.addForm.controls; }

  onSubmit() {
    this.submitted = true;

    /* console.log("First: userID1 - "
      + this.addForm.value.user_id
      + ", ProjectName - " + this.addForm.value.project_name
      + ", StartDate - " + this.addForm.value.start_date
      + ", EndDate - " + this.addForm.value.end_date
      + ", Prirority - " + this.addForm.value.priority
    ); */

    // stop here if form is invalid
    if (this.addForm.invalid) {
      //console.log("Insdie validation")
      return;
    }

    //console.log("OutSide validation")

    if (this.addForm.value.priority == 0) {
      this.addForm.value.priority = 15;
    }

    this.submitted = false;

    if (new Date(this.addForm.value.start_date).getTime() > new Date(this.addForm.value.end_date).getTime()) {
      this.isErrorFound = true;
      this.errorMessage = "End date should be grearter than Start date";
      return;
    }

    if (!this.addForm.value.user_id) {
      this.isErrorFound = true;
      this.errorMessage = "Enter a manager id";
      return;
    }

    if (this.addForm.value.project_id) {
      this.apiProjectService.updateProject(this.addForm.value).subscribe((data: any) => {
        if (data.error_message) {
          this.isErrorFound = true;
          this.errorMessage = data.error_message;
          return;
        }

        this.isEditProject = false;
        this.ngOnInit();
      });
    } else {
      this.apiProjectService.addProject(this.addForm.value).subscribe((data: any) => {
        if (data.error_message) {
          this.isErrorFound = true;
          this.errorMessage = data.error_message;
          return;
        }

        this.ngOnInit();
      });
    }
  }

  editProject(projectId: number) {
    sessionStorage.setItem("projectEditId", `${projectId}`);
    this.ngOnInit();
  }

  suspendProject(projectId: number) {
    this.apiProjectService.suspendProjectById(projectId).subscribe(response => this.ngOnInit(), err => {
      throw err;
    });
  }

  activeProject(projectId: number) {
    this.apiProjectService.activateProjectById(projectId).subscribe(response => this.ngOnInit(), err => {
      throw err;
    });
  }

  resetProject() {
    this.submitted = false;
    this.isEditProject = false;
    this.isErrorFound = false;
    this.errorMessage = "";
    this.checkboxValue = false;
    this.addForm.reset();
  }

  setStartAndEndDate() {
    if (this.checkboxValue) {
      let nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + 1);

      this.projectRequest.start_date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      this.projectRequest.end_date = this.datePipe.transform(nextDate, 'yyyy-MM-dd');
    } else {
      this.projectRequest.start_date = "";
      this.projectRequest.end_date = "";
    }

    this.projectRequest.project_id = this.addForm.value.project_id;
    this.projectRequest.project_name = this.addForm.value.project_name;
    this.projectRequest.priority = this.addForm.value.priority
    this.projectRequest.user_id = this.addForm.value.user_id;

    this.addForm.setValue(this.projectRequest);

    //console.log("Check value for checkBox:" + this.addForm.value.user_id + "," + this.addForm.value.project_name + "," + this.addForm.value.start_date);
  }

  private findAllProjects() {
    this.apiProjectService.getAllProjectsDetails().subscribe(data => this.projectList = data);
  }

  private findAllUsersWithNoProject() {
    this.apiUserService.getAllUsersWithNoProject().subscribe(data => this.userList = data);
  }

  sort(name: string): void {
    if (name && this.sortingName !== name) {
      this.isDesc = false;
    } else {
      this.isDesc = !this.isDesc;
    }
    this.sortingName = name;
  }

  open(content: any) {
    this.findAllUsersWithNoProject();
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((user) => {
      this.setFormValueUserId(user);
      this.closeResult = `Closed with: ${user}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  private setFormValueUserId(selectedUser: User) {
    this.projectRequest.start_date = this.addForm.value.start_date;
    this.projectRequest.end_date = this.addForm.value.end_date;
    this.projectRequest.project_id = this.addForm.value.project_id;
    this.projectRequest.project_name = this.addForm.value.project_name;
    this.projectRequest.priority = this.addForm.value.priority
    this.projectRequest.user_id = selectedUser.user_id;

    this.addForm.setValue(this.projectRequest);
  }

  private setFormValueEditProject() {
    this.projectRequest.project_id = this.existingProject.project_id;
    this.projectRequest.project_name = this.existingProject.project_name;
    this.projectRequest.start_date = this.existingProject.start_date.toString();
    this.projectRequest.end_date = this.existingProject.end_date.toString();
    this.projectRequest.priority = this.existingProject.priority
    this.projectRequest.user_id = this.existingProject.user_id;

    this.addForm.setValue(this.projectRequest);
  }
}
