import { Component, OnInit, Inject } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { Employee, Employee_Roles, Role } from '../employee.model';
import {
  MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent,
  MatDialogActions, MatDialogClose,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, FormBuilder, FormsModule, Validators, FormArray } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-employee-dialog-edit',
  templateUrl: './employee-dialog-edit.component.html',
  styleUrl: './employee-dialog-edit.component.css'
})
export class EmployeeDialogEditComponent implements OnInit {
  [x: string]: any;

  editForm!: FormGroup;
  roles!: Role[];
  selectedRoleId: number | undefined;
  employee!: Employee;
  employeeRoles!: Employee_Roles[];
  minBirthDate: Date;
  minStartDate: Date;
  maxStartDate: Date;
  maxBirthDate: Date;
  genders: string[] = ["זכר", "נקבה"];
  isDisabled: boolean = true; // הגדרת isDisabled כברירת מחדל

  constructor(
    private dialogRef: MatDialogRef<EmployeeDialogEditComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private employeeService: EmployeeService
  ) {
    const currentYear = new Date().getFullYear();
    this.maxStartDate = new Date(currentYear, 4, 1);
    this.maxBirthDate = new Date(currentYear - 16, 4, 1);
    this.minBirthDate = new Date(1944, 1, 1);
    this.minStartDate = new Date(2000, 11, 31);

  }
  // getEmployeeById(id: number): Promise<any> {
  //   const res = this.employeeService.getEmployeeById(id).toPromise();
  //   return res;
  // }

  async ngOnInit() {
    console.log('ngOnInit')
    this.employee = this.data.employee; 
    this.roles=this.data.roles;
    this.employeeRoles=this.data.employeeRoles;
    // this.employeeService.getEmployeeById(id).subscribe(res => {
    //   // המשך התכנית לאחר קבלת נתונים
    //   this.employee = res;
      // this.employeeService.getRoles().subscribe(roles => {
      //   this.roles = roles;
      // });
      console.log('m')
      console.log(this.employee)
      this.editForm = new FormGroup({
        id: new FormControl(''),
        firstName: new FormControl('', Validators.required),
        lastName: new FormControl('', Validators.required),
        birthDate: new FormControl('', Validators.required),
        startDate: new FormControl('', Validators.required),
        gender: new FormControl('', Validators.required),
      });
      console.log(this.employee);
      const emp = {
        id: this.employee.id,
        firstName: this.employee.firstName,
        lastName: this.employee.lastName,
        birthDate: this.employee.birthDate,
        startDate: this.employee.startDate,
        gender: this.employee.gender === 1 ? 'זכר' : 'נקבה'
       }
      this.editForm.patchValue(emp);
    // });
    // () => {
    //   console.log("ops! getEmployeeById(id) didn't work")
    //   // this.employee = {
    //   //   firstName: "פלוני",
    //   //   lastName: "",
    //   //   id: 111111111,
    //   //   birthDate: new Date(),
    //   //   startDate: new Date(),
    //   //   gender: 0,
    //   //   status: true
    //   // }
    // }
  }
  onSubmit(): void {
    var employeeToUpdate = this.editForm.value;
    // employee.roles = employee.roles.map((roleId: any) => {
    //   return { id: roleId };
    // });
    employeeToUpdate.id = this.employee.id;
    employeeToUpdate.status = true;
    this.editForm.value.gender === 'נקבה' ? employeeToUpdate.gender = 0 : employeeToUpdate.gender = 1;
    this.employeeService.updateEmployee(this.employee.id, employeeToUpdate).subscribe(() => {
      this.dialogRef.close(true);
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onRoleAdd(): void {
    const roles = this.editForm.value.get('roles');
    const selectedRole = this.roles.find(role => !roles.includes(role.id));
    if (selectedRole) {
      roles.push(selectedRole.id);
      this.editForm.value.get('roles').setValue(roles);
    }
  }
  addRole(): void {
    // ודא שהמשתמש בחר תפקיד
    const selectedRole = this.selectedRoleId;
    if (!selectedRole) {
      return;
    }
  
    // מצא את התפקיד שנבחר
    const role = this.roles.find((r) => r.id === selectedRole);
    if (!role) {
      return;
    }
  
    // ודא שלא ניתן לבחור תפקיד פעמיים
    if (this.employeeRoles.some((r) => r.RoleId === role.id)) {
      return;
    }
  
    // הוסף את התפקיד לרשימה
    // this.employeeRoles.push(role);
  
    // איפוס בחירת התפקיד
    this.selectedRoleId = undefined;
  }
  
  onRoleRemove(roleId: number): void {
    const roles = this.editForm.value.get('roles').value;
    const index = roles.indexOf(roleId);
    if (index !== -1) {
      roles.splice(index, 1);
      this.editForm.value.get('roles').setValue(roles);
    }
  }
}
