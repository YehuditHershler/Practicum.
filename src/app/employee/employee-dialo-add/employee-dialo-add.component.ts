import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent,
  MatDialogActions, MatDialogClose, } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, FormBuilder, FormsModule, Validators, FormArray } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Employee, Role } from '../employee.model';
import { EmployeeService } from '../employee.service';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
@Component({
  selector: 'app-employee-dialo-add',
  templateUrl: './employee-dialo-add.component.html',
  styleUrl: './employee-dialo-add.component.css'
})

export class EmployeeDialoAddComponent implements OnInit {
[x: string]: any;

  employeeForm!: FormGroup;
  genders: string[] = ["זכר", "נקבה"];
  minBirthDate: Date;
  minStartDate: Date;
  maxStartDate: Date;
  maxBirthDate: Date;

  constructor(
    private fb: FormBuilder,
    private _employeeService: EmployeeService,
    public dialogRef: MatDialogRef<EmployeeDialoAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      const currentYear = new Date().getFullYear();
      this.maxStartDate = new Date(currentYear, 4, 1);
      this.maxBirthDate = new Date(currentYear-16, 4, 1);
      this.minBirthDate = new Date(1960, 1, 1);
      this.minStartDate = new Date(2000, 11, 31);
     }

  ngOnInit(): void {
    this.employeeForm = new FormGroup({
      "firstName": new FormControl('', [Validators.required]),
      "lastName": new FormControl('', [Validators.required]),
      "id": new FormControl('', [Validators.required, Validators.pattern('[0-9]{9}')]),
      "startDate": new FormControl(new Date(), [Validators.required]),
      "birthDate": new FormControl(new Date(), [Validators.required]),
      "gender": new FormControl(this.genders[0], [Validators.required]),
      // "roles": new FormArray([])
    });


  }

  onSubmit() {
    if (this.employeeForm.valid) {
      var employee: Employee = this.employeeForm.value;
      employee.status=true;
      employee.gender="זכר"?employee.gender=0:employee.gender=1;
      // employee.roles = []; // TODO: handle roles
      this._employeeService.addEmployeeToServer(employee).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}


