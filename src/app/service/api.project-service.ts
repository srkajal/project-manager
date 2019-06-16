import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../shared/app.config';
import { Project } from '../model/project.model';
import { map } from 'rxjs/operators';
import { ProjectRequest } from '../model/project-request.model';

@Injectable({
    providedIn: "root"
})
export class ApiProjectService {
    _baseUrl: string;
    constructor(private httpClient: HttpClient) {
        this._baseUrl = AppConfig.baseUrl;
    }

    getAllProjects() {
        return this.httpClient.get<Array<Project>>(this._baseUrl + AppConfig.findAllProjecstUrl)
            .pipe(map((response: any) => response.projects));
    }

    getAllProjectsDetails() {
        return this.httpClient.get<Array<Project>>(this._baseUrl + AppConfig.findAllProjectsDetailsUrl)
            .pipe(map((response: any) => response.projects));
    }

    getAllActiveProjects() {
        return this.httpClient.get<Array<Project>>(this._baseUrl + AppConfig.findAllActiveProjectUrl)
            .pipe(map((response: any) => response.projects));
    }

    addProject(projectRequest: ProjectRequest) {
        return this.httpClient.post(this._baseUrl + AppConfig.addProjectUrl, projectRequest);
    }

    getProjectById(projectId: number){
        return this.httpClient.get<Project>(this._baseUrl + AppConfig.findProjectByIdUrl + projectId)
        .pipe(map((response: any)=>response.project));
    }

    suspendProjectById(projectId: number){
        return this.httpClient.get(this._baseUrl + AppConfig.suspendProjectByIdUrl + projectId);
    }

    activateProjectById(projectId: number){
        return this.httpClient.get(this._baseUrl + AppConfig.activateProjectByIdUrl + projectId);
    }
    updateProject(projectRequest: ProjectRequest) {
        return this.httpClient.post(this._baseUrl + AppConfig.updateProjectUrl, projectRequest);
    }
}