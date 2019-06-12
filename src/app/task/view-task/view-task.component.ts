import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiTaskService } from '../../service/api.task-service';
import { Task } from '../../model/task.model';
import { TaskFilter } from '../../model/task-filter.model';
import { SearchFilter } from '../../model/search-filter.model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Project } from 'src/app/model/project.model';
import { ApiProjectService } from '../../service/api.project-service';

@Component({
  selector: 'view-task',
  templateUrl: './view-task.component.html',
  styleUrls: ['./view-task.component.css']
})
export class ViewTaskComponent implements OnInit {
  taskList: Array<Task> = [];
  searchFilter: SearchFilter = new SearchFilter();
  sortingName: string;
  isDesc: boolean;
  closeResult: string;
  projectList: Array<Project> = [];
  parentProject: Project = new Project();

  constructor(private ApiTaskService: ApiTaskService, private apiProjectService: ApiProjectService, private modalService: NgbModal, private router: Router) { }

  ngOnInit() {
    this.getAllTasks();
    this.getProjectList();
  }

  getAllTasks() {
    this.ApiTaskService.getAllTasks().subscribe((data: any) => {
      this.taskList = data.tasks;
    });
  }

  endTask(taskId: number) {
    this.ApiTaskService
      .endTask(taskId)
      .subscribe((data: any) => {
        this.taskList.forEach((t: Task) => {
          if (t.task_id == taskId) {
            t.status = 'CLOSED';
          }
        })
      });
  }

  editTask(taskId: number) {
    sessionStorage.removeItem("editTaskId");
    sessionStorage.setItem("editTaskId", taskId.toString());

    this.router.navigate(['add-task']);
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
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((response) => {
      //console.log("ProjectId:" + response['project_name'] + "," + response['first_name'] + "," + response['parent_task_name']);

      (<HTMLInputElement>document.getElementById("searchValue")).value = response.project_id;
      this.searchFilter.project_id = response.project_id;
      this.closeResult = `Closed with: ${response}`;
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

  private getProjectList() {
    return this.apiProjectService.getAllProjects().subscribe(data =>
      this.projectList = data)
  }
}
