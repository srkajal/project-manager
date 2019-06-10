import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiTaskService } from '../../service/api.task-service';
import { Router } from '@angular/router';
import { Task } from '../../model/task.model';
import { TaskRequest } from '../../model/task-request.model';
import { ParentTask } from '../../model/parent-task.model';
import { Project } from 'src/app/model/project.model';
import { ApiProjectService } from '../../service/api.project-service'
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../model/user.model';
import { ApiUserService } from '../../service/api.user-service';



@Component({
  selector: 'app-task-add',
  templateUrl: './task-add.component.html',
  styleUrls: ['./task-add.component.css']
})
export class TaskAddComponent implements OnInit {

  constructor(private apiTaskService: ApiTaskService, private apiProjectService: ApiProjectService, private apiUserService: ApiUserService, private formBuilder: FormBuilder, private modalService: NgbModal, private router: Router) { }

  addForm: FormGroup;
  defaultPrirority: number = 15;
  editTask: Task;
  parentTaskList: Array<ParentTask> = [];
  activeProjectList: Array<Project> = [];
  userList: Array<User> = [];
  taksRequest: TaskRequest = new TaskRequest();
  parentProject: Project = new Project();
  parentTask: ParentTask = new ParentTask();
  taskUser: User = new User();
  submitted = false;
  checkboxValue: boolean = false;
  closeResult: string;

  ngOnInit() {
    this.getParentTaskList();
    this.findAllActiveProjects();
    this.getUserList();

    this.addForm = this.formBuilder.group({
      task_name: ['', Validators.required],
      priority: ['', Validators.min(1)],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      parent_id: [0, Validators.min(0)],
      user_id: [0, Validators.min(0)],
      project_id: [0, Validators.min(0)]
    });
  }

  // convenience getter for easy access to form fields
  get formField() { return this.addForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.addForm.value.priority == "") {
      this.addForm.value.priority = this.defaultPrirority;
    }

    // stop here if form is invalid
    if (this.addForm.invalid) {
      return;
    }

    this.apiTaskService.addTask(this.addForm.value).subscribe(response => this.router.navigate(['tasks']));
  }

  resetTask() {
    this.addForm.reset();
  }

  private getParentTaskList() {
    this.apiTaskService.getAllParentTasks().subscribe((data: any) => {
      this.parentTaskList = data.parent_tasks;
    });
  }

  private getUserList() {
    this.apiUserService.getAllUsersWithNoTask().subscribe((data: any) => {
      this.userList = data;
    });
  }

  toggle() {
    console.log("CheckboxValue:" + this.checkboxValue);
    
    this.disableField('start_date');
    this.disableField('end_date');
    this.disableField('priority');
    this.disableField('parent_id');
    this.disableField('user_id');
    this.disableField('project_id');
  }

  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((response) => {
      console.log("ProjectId:"+ response['project_name'] + ","+ response['first_name'] +"," + response['parent_task_name']);

      if(response['project_name']) {
        this.setFormValueProjectId(response);
      } else if(response['first_name']){
        this.setFormValueUserId(response);
      } else if(response['parent_task_name']){
        this.setFormValueParentTaskId(response);
      }
      
      
      
      this.closeResult = `Closed with: ${response}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private setFormValueProjectId(selectedProject: Project) {
    this.taksRequest.task_name = this.addForm.value.start_date;
    this.taksRequest.start_date = this.addForm.value.start_date;
    this.taksRequest.end_date = this.addForm.value.end_date;
    this.taksRequest.project_id = selectedProject.project_id;
    this.taksRequest.parent_id = this.addForm.value.parent_id;
    this.taksRequest.priority = this.addForm.value.priority
    this.taksRequest.user_id = this.addForm.value.user_id;

    this.addForm.setValue(this.taksRequest);
  }

  private setFormValueUserId(selectedUser: User) {
    this.taksRequest.task_name = this.addForm.value.start_date;
    this.taksRequest.start_date = this.addForm.value.start_date;
    this.taksRequest.end_date = this.addForm.value.end_date;
    this.taksRequest.project_id = this.addForm.value.project_id;
    this.taksRequest.parent_id = this.addForm.value.parent_id;
    this.taksRequest.priority = this.addForm.value.priority
    this.taksRequest.user_id = selectedUser.user_id;

    this.addForm.setValue(this.taksRequest);
  }

  private setFormValueParentTaskId(selectedParentTask: ParentTask) {
    this.taksRequest.task_name = this.addForm.value.start_date;
    this.taksRequest.start_date = this.addForm.value.start_date;
    this.taksRequest.end_date = this.addForm.value.end_date;
    this.taksRequest.project_id = this.addForm.value.project_id;
    this.taksRequest.parent_id = selectedParentTask.parent_id;
    this.taksRequest.priority = this.addForm.value.priority
    this.taksRequest.user_id = this.addForm.value.user_id;

    this.addForm.setValue(this.taksRequest);
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

  private disableField(controlerName: string){
    let control = this.addForm.get(controlerName)
    control.disabled ? control.enable() : control.disable();
  }

  private findAllActiveProjects(){
    this.apiProjectService.getAllActiveProjects().subscribe(response=>this.activeProjectList = response);
  }
}
