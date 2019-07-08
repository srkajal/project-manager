import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
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
  closeResult: string;
  userList: Array<User> = [];
  manager: User = new User(1);
  managerId: number;
  sortingName: string;
  isDesc: boolean;
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
        //this.existingProject = data;

        sessionStorage.removeItem("projectEditId");
        this.isEditProject = true;

        this.setFormValueEditProject(data);
      });
    }

    this.addForm = this.formBuilder.group({
      project_id: new FormControl('', Validators.min(0)),
      project_name: new FormControl('', Validators.required),
      start_date: new FormControl('', Validators.required),
      end_date: new FormControl('', Validators.required),
      priority: new FormControl(''),
      user_id: new FormControl('', [Validators.required, Validators.pattern('^[1-9]+[0-9]*$')])
    });

    this.findAllProjects();
  }

  // convenience getter for easy access to form fields
  get formField() { return this.addForm.controls; }

  onSubmit() {
    this.submitted = true;

    console.log("First: userID - "
      + this.addForm.value.user_id
      + ", ProjectName - " + this.addForm.value.project_name
      + ", StartDate - " + this.addForm.value.start_date
      + ", EndDate - " + this.addForm.value.end_date
      + ", Prirority - " + this.addForm.value.priority
    );

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
    let startDate = "";
    let endDate = "";

    if (this.checkboxValue) {
      let nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + 1);

      startDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      endDate = this.datePipe.transform(nextDate, 'yyyy-MM-dd');
    }

    this.addForm.patchValue({ 'start_date': startDate });
    this.addForm.patchValue({ 'end_date': endDate });

    //console.log("Check value for checkBox:" + this.addForm.value.user_id + "," + this.addForm.value.project_name + "," + this.addForm.value.start_date);
  }

  private findAllProjects() {
    this.apiProjectService.getAllProjects().subscribe(data => this.projectList = data);
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

      this.addForm.patchValue({ 'user_id': user.user_id });
      console.log("UserId:" + user.user_id);
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

  private setFormValueEditProject(existingProject: Project) {
    let projectRequest: ProjectRequest = new ProjectRequest();

    let props = Object.keys(projectRequest);

    for(let prop of props){
      if(prop.endsWith('date')){
        projectRequest[prop] = existingProject[prop].toString();
      } else {
        projectRequest[prop] = existingProject[prop];
      }
    }

    this.addForm.setValue(projectRequest);
  }

  get projectName(){
    return this.addForm.get('project_name');
  }

  get startDate(){
    return this.addForm.get('start_date');
  }

  get endDate(){
    return this.addForm.get('end_date');
  }

  get priority(){
    return this.addForm.get('priority');
  }

  get userId(){
    return this.addForm.get('user_id');
  }
}
