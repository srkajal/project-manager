import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewTaskComponent } from './task/view-task/view-task.component';
import { TaskAddComponent } from './task/task-add/task-add.component';
import { UserComponent } from './user/user.component';
import { ProjectComponent } from './project/project.component';

const routes: Routes = [
  {path: '', redirectTo: 'view-task', pathMatch: 'full'},
  {path: 'view-task', component: ViewTaskComponent},
  {path: 'add-task', component: TaskAddComponent},
  {path: 'add-user', component: UserComponent},
  {path: 'add-project', component: ProjectComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }