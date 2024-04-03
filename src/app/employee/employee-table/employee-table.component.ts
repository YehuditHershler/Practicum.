import { Component, EventEmitter, Input, Output, input, Inject } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Employee } from '../employee.model';
import { EmployeeService } from '../employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FileSaverService } from 'ngx-filesaver';
import * as xl from 'exceljs';
import { DatePipe } from '@angular/common';
// import { EmployeeDialoAddComponent } from '../employee-dialo-add/employee-dialo-add.component';
import {
  MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle,
  MatDialogContent, MatDialogActions, MatDialogClose,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FilterByStatusPipe } from '../filter-by-status.pipe';
import { EmployeeDialoAddComponent } from '../employee-dialo-add/employee-dialo-add.component';
import { EmployeeDialogEditComponent } from '../employee-dialog-edit/employee-dialog-edit.component';
import { MatSortable } from '@angular/material/sort';


@Component({
  selector: 'app-employee-table',
  // standalone: true,
  // imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule],
  templateUrl: './employee-table.component.html',
  styleUrl: './employee-table.component.css'

})
export class EmployeeTableComponent {

  // @Input() employee!: Employee;
  employees!: Employee[];
  emp!: Employee;
  employeeObservable!: Observable<Employee[]>;
  @Output() editEmployee = new EventEmitter<Employee>();
  @Output() deleteEmployee = new EventEmitter<number>();

  employeeForm!: FormGroup;

  constructor(
    private _employeeService: EmployeeService,
    private router: Router,
    route: ActivatedRoute,
    private http: HttpClient,
    public table: MatTableModule,
    private fileSaver: FileSaverService,
    public dialog: MatDialog,
  ) { }
  ngOnInit() {
    this.employeeObservable = this._employeeService.getEmployeesFromServer();
    this.employeeObservable.subscribe((emp) => {
      this.employees = emp;
    });
    console.log(this.employees)
  }

  // onSubmit() {
  //   // TODO: Validate form and emit edit event
  // }

  addEmployee(): void {
    console.log()
    const dialogRef = this.dialog.open(EmployeeDialoAddComponent, {
      height: '400px',
      width: '600px',
    })
    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      // this.employees.add(result);
      console.log(result)
      this.employeeObservable = this._employeeService.getEmployeesFromServer();
      this.employeeObservable.subscribe((emp) => {
        this.employees = emp;
      });
      console.log(this.employees);
      // this._employeeService.addEmployeeToServer(result);
    });
  }

  onEdit(id: number) {
    this._employeeService.getEmployeeById(id).subscribe(eRes => {
      this._employeeService.getRoles().subscribe(rRes => {
        const roles = rRes;
        const employee = eRes;
        this._employeeService.getEmployeeRolesFromServer(employee.id).subscribe(erRes => {
          const employeeRoles = erRes;
          const dialogRef = this.dialog.open(EmployeeDialogEditComponent, {
            height: '400px',
            width: '600px',
            data: {
              employee: employee,
              roles: roles,
              employeeRoles: employeeRoles
            }
          });
          dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            console.log(result)
            this.employeeObservable = this._employeeService.getEmployeesFromServer();
            this.employeeObservable.subscribe((emp) => {
              this.employees = emp;
            });
          });
        });
        console.log(this.employees);
      });
    });
  }

  async onDelete(id: number) {
    const res = await this._employeeService.getEmployeeById(id).toPromise();
    if (res) {
      this.emp = res;
    }
    console.log(this.emp);
    this.emp.status = false;
    console.log(this.emp);
    await this._employeeService.updateEmployee(id, this.emp).toPromise();
    this.employeeObservable = this._employeeService.getEmployeesFromServer();
    this.employeeObservable.subscribe((emp) => {
      this.employees = emp;
    });
    console.log(this.employees);
  }

  async exportToExcel() {
    var data: any = "";
    console.log(this.employees);
    if (this.employees) {
      data = this.employees.map(employee => {
        return {
          'ת.ז.': employee.id,
          'שם פרטי': employee.firstName,
          'שם משפחה': employee.lastName,
          'תאריך תחילת עבודה': employee.startDate,
          'תאריך לידה': employee.birthDate,
          'מגדר': employee.gender ? "גבר" : "אשה",
        };
      });
    } else {
      console.log('אין נתוני עובדים זמינים לייצוא');
    }
    const wb = new xl.Workbook();
    const ws = wb.addWorksheet('Employees');
    // הגדרת שם קובץ
    const filename = 'דו"ח עובדים - ' + new Date().toISOString().slice(0, 10) + '.xlsx';
    // הגדרת סגנונות
    const headerStyle = {
      font: { bold: true },
      alignment: { horizontal: 'center' },
    };
    const cellStyle = {
      alignment: { horizontal: 'left' },
    };

    ws.getCell('A1').value = 'שם פרטי';
    ws.getCell('B1').value = 'שם משפחה';
    ws.getCell('C1').value = 'ת.ז.';
    ws.getCell('D1').value = 'תאריך תחילת עבודה';
    ws.getCell('E1').value = 'תאריך לידה';
    ws.getCell('F1').value = 'מגדר';
    ///
    // ws.getCell('G1').value = 'תפקיד | קוד';
    // ws.getCell('H1').value = 'תפקיד | שם';
    // ws.getCell('I1').value = 'תפקיד | תאריך כניסה לתפקיד';


    for (let i = 0; i < data.length; i++) {
      ws.getCell(`A${i + 2}`).value = data[i]['שם פרטי'];
      ws.getCell(`B${i + 2}`).value = data[i]['שם משפחה'];
      ws.getCell(`C${i + 2}`).value = data[i]['ת.ז.'];
      ws.getCell(`D${i + 2}`).value = data[i]['תאריך תחילת עבודה'];
      ws.getCell(`E${i + 2}`).value = data[i]['תאריך לידה'];
      ws.getCell(`F${i + 2}`).value = data[i]['מגדר'];
      // ws.getCell(`${String.fromCharCode(65 + j)}${row}`).style = cellStyle;
    }
    // כותרות עמודות
    const headers = Object.keys(data[0]);
    for (let i = 0; i < headers.length; i++) {
      ws.getCell(`A${i + 1}`).value = headers[i];
    }

    // // נתונים
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < headers.length; j++) {
        const cellValue = data[i][headers[j]];
        ws.getCell(`${String.fromCharCode(65 + j)}${i + 2}`).value = cellValue;
      }
    }
    const buffer = await wb.xlsx.writeBuffer();
    const file = new File([buffer], 'employees.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    this.fileSaver.save(file);
  }
  trackByFn(index: number, item: any) {
    return index;
  }
}
