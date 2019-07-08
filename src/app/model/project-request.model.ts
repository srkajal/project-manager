import { Project } from './project.model';

export class ProjectRequest{
    project_id: number;
    project_name: string;
    start_date: String;
    end_date: String;
    priority: number;
    user_id: number;

    constructor(project_id?: number, project_name?: string,start_date?: String, end_date?: String, priority?: number, user_id?: number){
        this.project_id = project_id;
        this.project_name = project_name;
        this.start_date = start_date;
        this.end_date = end_date;
        this.priority = priority;
        this.user_id = user_id;
    }
}