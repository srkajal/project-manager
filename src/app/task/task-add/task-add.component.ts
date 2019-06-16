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
import { AppConfig } from '../../shared/app.config';


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
  parentCheckbox: boolean = false;
  closeResult: string;
  isErrorFound: boolean = false;
  errorMessages: Array<string> = [];
  existingTask: Task = new Task();
  isEditTask: boolean = false;

  ngOnInit() {
    this.getParentTaskList();
    this.findAllActiveProjects();
    this.getUserList();

    let editTaskId = sessionStorage.getItem("editTaskId");

    if (editTaskId) {
      this.apiTaskService.getTaskById(Number(editTaskId)).subscribe(data => {
        this.existingTask = data;

        sessionStorage.removeItem("editTaskId");
        this.isEditTask = true;

        this.setFormValueEditTask();
      });
    }

    this.addForm = this.formBuilder.group({
      task_name: ['', Validators.required],
      priority: ['', Validators.min(1)],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      parent_id: [0, Validators.min(0)],
      user_id: [0],
      project_id: [0],
      task_id: [0]
    });
  }

  // convenience getter for easy access to form fields
  //get formField() { return this.addForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.isErrorFound = false;
    this.errorMessages = [];

    if (this.addForm.value.priority == "") {
      this.addForm.value.priority = this.defaultPrirority;
    }

    this.validation();

    if (this.isErrorFound) {
      return;
    }

    if (this.parentCheckbox) {
      let parentTask: ParentTask = new ParentTask();
      parentTask.parent_task_name = this.addForm.value.task_name;
      this.apiTaskService.addParentTask(parentTask).subscribe((data: any) => {
        if (data.error_message) {
          this.isErrorFound = true;
          this.errorMessages.push(data.error_message);
          return;
        }

        this.router.navigate(['view-task']);
      });

    } else if (this.addForm.value.task_id) {
      this.apiTaskService.updateTask(this.addForm.value).subscribe((data: any) => {
        if (data.error_message) {
          this.isErrorFound = true;
          this.errorMessages.push(data.error_message);
          return;
        }

        this.router.navigate(['view-task']);
      });
    } else {
      this.apiTaskService.addTask(this.addForm.value).subscribe((data: any) => {
        if (data.error_message) {
          this.isErrorFound = true;
          this.errorMessages.push(data.error_message);
          return;
        }

        this.router.navigate(['view-task']);
      });
    }
  }

  resetTask() {

    if (this.parentCheckbox) {
      this.toggle();
      this.parentCheckbox = false;
    }
    this.isEditTask = false;
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
    this.disableField('start_date');
    this.disableField('end_date');
    this.disableField('priority');
    this.disableField('parent_id');
    this.disableField('user_id');
    this.disableField('project_id');
  }

  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((response) => {
      //console.log("ProjectId:" + response['project_name'] + "," + response['first_name'] + "," + response['parent_task_name']);

      if (response['project_name']) {
        this.setFormValue(response, 'project_id');
      } else if (response['first_name']) {
        this.setFormValue(response, 'user_id');
      } else if (response['parent_task_name']) {
        this.setFormValue(response, 'parent_id');
      }
      this.closeResult = `Closed with: ${response}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private setFormValue(selectedProject: Project, selectedFieldName: string) {
    for (var field of AppConfig.taskFields) {
      if (field != selectedFieldName) {
        this.taksRequest[field] = this.addForm.get(field).value;
      } else {
        this.taksRequest[field] = selectedProject[field];
      }
      //console.log("TaskRequest["+ filed+"]"+ this.addForm.get(filed).value+ ";" + this.taksRequest[filed]);
    }

    this.addForm.setValue(this.taksRequest);
  }

  private setFormValueEditTask() {

    let ext_parent_id = this.existingTask.parent_task == null ? 0 : this.existingTask.parent_task.parent_id;
    this.taksRequest.task_name = this.existingTask.task_name;
    this.taksRequest.start_date = this.existingTask.start_date.toString();
    this.taksRequest.end_date = this.existingTask.end_date.toString();
    this.taksRequest.project_id = this.existingTask.project_id;
    this.taksRequest.parent_id = ext_parent_id;
    this.taksRequest.priority = this.existingTask.priority
    this.taksRequest.user_id = this.existingTask.user_id;
    this.taksRequest.task_id = this.existingTask.task_id;

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

  private disableField(controlerName: string) {
    let control = this.addForm.get(controlerName)
    control.disabled ? control.enable() : control.disable();
  }

  private findAllActiveProjects() {
    this.apiProjectService.getAllActiveProjects().subscribe(response => this.activeProjectList = response);
  }

  private validation(): void {

    if (this.addForm.value.task_name == "") {
      this.isErrorFound = true;
      this.errorMessages.push("Task name required");
    }

    if (!this.parentCheckbox) {
      if (!this.isEditTask) {
        if (this.addForm.value.project_id == null || this.addForm.value.project_id == 0) {
          this.isErrorFound = true;
          this.errorMessages.push("Project id required");
        }

        if (this.addForm.value.user_id == null || this.addForm.value.user_id == 0) {
          this.isErrorFound = true;
          this.errorMessages.push("User id required");
        }
      }

      if (this.addForm.value.start_date == "") {
        this.isErrorFound = true;
        this.errorMessages.push("Start date required");
      }

      if (this.addForm.value.end_date == "") {
        this.isErrorFound = true;
        this.errorMessages.push("End date required");
      }

      if (this.addForm.value.start_date != "" && this.addForm.value.end_date != "" && new Date(this.addForm.value.start_date).getTime() > new Date(this.addForm.value.end_date).getTime()) {
        this.isErrorFound = true;
        this.errorMessages.push("Start date should be greater than end date");
      }
    }
  }
}
