import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {ReactiveFormsModule, FormsModule} from "@angular/forms";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ViewTaskComponent } from './task/view-task/view-task.component'
import { TaskAddComponent } from './task/task-add/task-add.component';
import { TaskFilterPipe } from './shared/task-filter.pipe';
import { UserComponent } from './user/user.component';
import { SortByPipe } from './shared/sort-by.pipe';
import { SearchFilterPipe } from './shared/search-filter.pipe';
import { ProjectComponent } from './project/project.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    ViewTaskComponent,
    TaskAddComponent,
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
    ReactiveFormsModule,
    NgbModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
