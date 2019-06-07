import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../model/user.model'
import { ApiUserService } from '../service/api.user-service'
import { SearchFilter } from '../model/search-filter.model';
import { Console } from '@angular/core/src/console';
import { UserRequest } from '../model/user-request.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  userList: Array<User> = [];
  searchFilter: SearchFilter = new SearchFilter();
  constructor(private apiUserService: ApiUserService, private formBuilder: FormBuilder, private router: Router) { }

  addForm: FormGroup;
  existingUser: User;
  userRequest: UserRequest = new UserRequest();
  submitted = false;
  isEditUser = false;
  sortingName: string;
  isDesc: boolean;

  ngOnInit() {

    let userEditId = sessionStorage.getItem("userEditId");

    if (userEditId) {
      this.apiUserService.getUserById(Number(userEditId)).subscribe(data => {
        this.existingUser = data;

        sessionStorage.removeItem("userEditId");
        this.isEditUser = true;

        this.userRequest.user_id = this.existingUser.user_id;
        this.userRequest.first_name = this.existingUser.first_name;
        this.userRequest.last_name = this.existingUser.last_name;
        this.userRequest.employee_id = this.existingUser.employee_id;

        this.addForm.setValue(this.userRequest);
      });
    }

    this.addForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      employee_id: ['', Validators.min(1)],
      user_id: ['', Validators.min(1)]
    });

    this.findAllUsers();
  }

  // convenience getter for easy access to form fields
  get formField() { return this.addForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.addForm.invalid) {
      return;
    }

    if (this.addForm.value.user_id) {
      this.apiUserService.updateUser(this.addForm.value).subscribe((data: any) => {
        this.submitted = false;
        this.isEditUser = false;
        this.ngOnInit();
      });
    } else {
      this.apiUserService.addUser(this.addForm.value).subscribe((data: any) => {
        this.submitted = false;
        this.ngOnInit();
      });
    }
  }

  findAllUsers() {
    this.apiUserService.getAllUsers().subscribe(data => this.userList = data);
  }

  resetUser() {
    this.submitted = false;
    this.isEditUser = false;
    this.addForm.reset();
  }

  sort(name: string): void {
    if (name && this.sortingName !== name) {
      this.isDesc = false;
    } else {
      this.isDesc = !this.isDesc;
    }
    this.sortingName = name;
  }

  editUser(userId: number) {
    sessionStorage.setItem("userEditId", `${userId}`);
    this.ngOnInit();
  }

  deleteUser(userId: number) {
    this.apiUserService.deleteUserById(userId).subscribe(response => this.ngOnInit());
  }
}
