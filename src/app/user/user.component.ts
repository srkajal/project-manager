import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../model/user.model'
import { ApiUserService } from '../service/api.user-service'
import { SearchFilter } from '../model/search-filter.model';
import { idValidator } from '../validators/id-validator';
import { UserRequest } from '../model/user-request.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  userList: Array<User> = [];
  searchFilter: SearchFilter = new SearchFilter();
  addForm: FormGroup;
  submitted = false;
  isEditUser = false;
  sortingName: string;
  isDesc: boolean;

  constructor(private apiUserService: ApiUserService, private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit() {

    let userEditId = sessionStorage.getItem("userEditId");

    if (userEditId) {
      this.apiUserService.getUserById(Number(userEditId)).subscribe(data => {
        sessionStorage.removeItem("userEditId");
        this.isEditUser = true;

        let userRequest: UserRequest = new UserRequest(data.user_id, data.first_name, data.last_name, data.employee_id);

        this.addForm.setValue(userRequest);
      });
    }

    this.addForm = this.formBuilder.group({
      first_name: new FormControl('', Validators.required),
      last_name: new FormControl('', Validators.required),
      employee_id: new FormControl('', [Validators.required, Validators.pattern('^[1-9]+[0-9]*$')]),
      user_id: new FormControl(0)
    });

    this.findAllUsers();
  }

  // convenience getter for easy access to form fields
  get formField() { return this.addForm.controls; }

  onSubmit() {
    this.submitted = true;

    console.log(this.addForm.controls);
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

  get firstName(){
    return this.addForm.get('first_name');
  }

  get lastName(){
    return this.addForm.get('last_name');
  }

  get employeeId(){
    return this.addForm.get('employee_id');
  }
}
