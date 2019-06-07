import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {ReactiveFormsModule, FormsModule} from "@angular/forms";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TaskListComponent } from './task/task-list/task-list.component';
import { TaskAddComponent } from './task/task-add/task-add.component';
import { TaskEditComponent } from './task/task-edit/task-edit.component';
import { TaskFilterPipe } from './shared/task-filter.pipe';
import { UserComponent } from './user/user.component';
import { SortByPipe } from './shared/sort-by.pipe';
import { SearchFilterPipe } from './shared/search-filter.pipe';
import { ProjectComponent } from './project/project.component'

@NgModule({
  declarations: [
    AppComponent,
    TaskListComponent,
    TaskAddComponent,
    TaskEditComponent,
    TaskFilterPipe,
    UserComponent,
    SortByPipe,
    SearchFilterPipe,
    ProjectComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
