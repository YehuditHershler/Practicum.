import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeeTableComponent } from './employee-table/employee-table.component';
import { EmployeeDialoAddComponent } from './employee-dialo-add/employee-dialo-add.component';
import { EmployeeRoutingModule } from './employee-routing.module';
import { EmployeeService } from './employee.service';
import { FileSaverService } from 'ngx-filesaver';
import { FilterByStatusPipe } from './filter-by-status.pipe';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule, NgFor } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { EmployeeDialogEditComponent } from './employee-dialog-edit/employee-dialog-edit.component';

@NgModule({
  // declarations: [],
  declarations: [EmployeeTableComponent, EmployeeDialoAddComponent, EmployeeDialogEditComponent],
  imports: [CommonModule, FilterByStatusPipe, FormsModule, NgFor, ReactiveFormsModule,
    EmployeeRoutingModule, MatSlideToggleModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatSelectModule,
    MatTableModule,
    MatNativeDateModule,],
  providers: [EmployeeService],
  // exports: [EmployeeDialoAddComponent]
})
export class EmployeeModule { }
