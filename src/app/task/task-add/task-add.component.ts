import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
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
import { idValidator } from 'src/app/validators/id-validator';
import { fieldValidator } from 'src/app/validators/field-validator';


const PROJECT_ID: string = 'project_id';
const PARENT_ID: string = 'parent_id';
const USER_ID: string = 'user_id';
@Component({
  selector: 'app-task-add',
  templateUrl: './task-add.component.html',
  styleUrls: ['./task-add.component.css']
})
export class TaskAddComponent implements OnInit {

  constructor(private apiTaskService: ApiTaskService, private apiProjectService: ApiProjectService, private apiUserService: ApiUserService, private formBuilder: FormBuilder, private modalService: NgbModal, private router: Router) { }

  addForm: FormGroup;
  parentTaskList: Array<ParentTask> = [];
  activeProjectList: Array<Project> = [];
  userList: Array<User> = [];
  parentProject: Project = new Project();
  parentTask: ParentTask = new ParentTask();
  taskUser: User = new User();
  submitted = false;
  parentCheckbox: boolean = false;
  closeResult: string;
  isErrorFound: boolean = false;
  errorMessages: Array<string> = [];
  isEditTask: boolean = false;

  ngOnInit() {
    this.getParentTaskList();
    this.findAllActiveProjects();
    this.getUserList();

    let editTaskId = sessionStorage.getItem("editTaskId");

    if (editTaskId) {
      this.apiTaskService.getTaskById(Number(editTaskId)).subscribe(data => {
        sessionStorage.removeItem("editTaskId");
        this.isEditTask = true;
        this.setFormValueEditTask(data);
      });
    }

    this.addForm = this.formBuilder.group({
      task_name: new FormControl('', Validators.required),
      priority: new FormControl(15),
      start_date: new FormControl('', fieldValidator(!this.parentCheckbox)),
      end_date: new FormControl('', fieldValidator(!this.parentCheckbox)),
      parent_id: new FormControl('', idValidator(!this.parentCheckbox)),
      user_id: new FormControl('', idValidator(!this.parentCheckbox && !this.isEditTask)),
      project_id: new FormControl('', idValidator(!this.parentCheckbox && !this.isEditTask)),
      task_id: new FormControl(0)
    });
  }

  onSubmit() {
    this.submitted = true;
    this.isErrorFound = false;
    this.errorMessages = [];

    //console.log('Prirority:' + this.addForm.value.priority);
    //console.log(this.addForm);

    if (this.addForm.invalid) {
      return;
    }

    this.validation();

    /* if (this.isErrorFound) {
      return;
    } */

    if (this.parentCheckbox) {
      let parentTask: ParentTask = new ParentTask(null, this.addForm.value.task_name);

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
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((response: any) => {
      console.log("ProjectId:" + response[PROJECT_ID] + "," + response['first_name'] + "," + response['parent_task_name']);

      if (response[PROJECT_ID]) {
        this.addForm.patchValue({ 'project_id': response[PROJECT_ID] });
      } else if (response[USER_ID]) {
        this.addForm.patchValue({ 'user_id': response[USER_ID] });
      } else if (response[PARENT_ID]) {
        this.addForm.patchValue({ 'parent_id': response[PARENT_ID] });
      }
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

  private setFormValueEditTask(taskToEdit: Task) {

    let taksRequest: TaskRequest = new TaskRequest();

    let props = Object.keys(taksRequest);

    for (let prop of props) {
      if (prop.endsWith('date')) {
        taksRequest[prop] = taskToEdit[prop].toString();
      } else if (prop.startsWith('parent_id')) {
        let ext_parent_id = taskToEdit.parent_task == null ? 0 : taskToEdit.parent_task.parent_id;
        taksRequest[prop] = ext_parent_id;
      } else {
        taksRequest[prop] = taskToEdit[prop];
      }
    }

    this.addForm.setValue(taksRequest);
  }

  private disableField(controlerName: string) {
    let control = this.addForm.get(controlerName)
    control.disabled ? control.enable() : control.disable();
  }

  private findAllActiveProjects() {
    this.apiProjectService.getAllActiveProjects().subscribe(response => this.activeProjectList = response);
  }

  private validation() {
    if (!this.parentCheckbox && new Date(this.addForm.value.start_date).getTime() > new Date(this.addForm.value.end_date).getTime()) {
      this.isErrorFound = true;
      this.errorMessages.push("Start date should be greater than end date");
      return;
    }
  }

  get taskName() {
    return this.addForm.get('task_name');
  }

  get projectId() {
    return this.addForm.get('project_id');
  }

  get startDate() {
    return this.addForm.get('start_date');
  }

  get endDate() {
    return this.addForm.get('end_date');
  }

  get userId() {
    return this.addForm.get('user_id');
  }

  get parentId() {
    return this.addForm.get('parent_id');
  }
}