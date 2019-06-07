import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../api.service';
import { Task } from '../../model/task.model';
import { TaskFilter } from '../../model/task-filter.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  taskList: Array<Task> = [];
  filter: TaskFilter = new TaskFilter();
  
  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit() {
    this.getAllTasks();
  }

  getAllTasks(){
    this.apiService.getAllTasks().subscribe((data: any)=>
    {
      this.taskList = data.tasks;
    });
  }

  endTask(taskId: number){
    this.apiService
    .endTask(taskId)
    .subscribe((data: any)=>{
      this.taskList.forEach((t:Task)=>{
      if(t.task_id == taskId){
        t.status = 'CLOSED';
      }
    })
  });
  }

  editTask(taskId: number){
    sessionStorage.removeItem("editTaskId");
    sessionStorage.setItem("editTaskId", taskId.toString());
    
    this.router.navigate(['edit-task']);
  }
}
