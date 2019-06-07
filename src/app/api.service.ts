import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { TaskRequest } from './model/task-request.model';
import { AppConfig } from './app.config';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  _baseUrl: string;

  constructor(private httpClient: HttpClient) { 
    this._baseUrl = AppConfig.baseUrl;
  }

  getAllTasks(){
    return this.httpClient.get(this._baseUrl + AppConfig.findAllTaskUrl);
  }

  getAllParentTasks(){
    return this.httpClient.get(this._baseUrl + AppConfig.findAllParentUrl);
  }

  endTask(taskId: number){
    return this.httpClient.get(this._baseUrl + AppConfig.closeTaskUrl + taskId);
  }

  addTask(taskRequest: TaskRequest){
    return this.httpClient.post(this._baseUrl + AppConfig.addTaskUrl, taskRequest);
  }

  updateTask(taskRequest: TaskRequest){
    return this.httpClient.post(this._baseUrl + AppConfig.updateTaskUrl, taskRequest);
  }

  getTaskById(taskId: number){
    return this.httpClient.get(this._baseUrl + AppConfig.findTaskByIdUrl + taskId);
  }
}
