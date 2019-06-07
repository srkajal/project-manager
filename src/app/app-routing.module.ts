import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskListComponent } from './task/task-list/task-list.component';
import { TaskAddComponent } from './task/task-add/task-add.component';
import { TaskEditComponent } from './task/task-edit/task-edit.component';
import { UserComponent } from './user/user.component';
import { ProjectComponent } from './project/project.component';

const routes: Routes = [
  {path: '', redirectTo: 'tasks', pathMatch: 'full'},
  {path: 'tasks', component: TaskListComponent},
  {path: 'add-task', component: TaskAddComponent},
  {path: 'edit-task', component: TaskEditComponent},
  {path: 'add-user', component: UserComponent},
  {path: 'add-project', component: ProjectComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }