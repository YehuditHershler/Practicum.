import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee, Employee_Roles, Role } from './employee.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) { }

  private readonly API_URL_E = 'http://localhost:5113/Employee';
  private readonly API_URL_E_R = 'http://localhost:5113/Employee_Role';
  private readonly API_URL_R = 'http://localhost:5113/Role';
  addEmployeeToServer(emp: Employee): Observable<any> {
    const jsonData = JSON.stringify(emp);
    console.log(jsonData)
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post(this.API_URL_E, jsonData, { headers });
  }
  getEmployeesFromServer(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.API_URL_E);
  }

  registerEmployee(emp: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.API_URL_E, emp);
  }
  getEmployeeById(id: number): Observable<Employee> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.get<Employee>(`${this.API_URL_E}/${id}`, { headers });
  }
  updateEmployee(id: number, emp: Employee){
    return this.http.put<any>(`${this.API_URL_E}/${id}`, emp)
  }
  //

  // addEmployeeRoleToServer(emp: Employee_Roles): Observable<any> {
  //   const jsonData = JSON.stringify(emp);
  //   console.log(jsonData)
  //   const headers = new HttpHeaders({
  //     "Content-Type": "application/json",
  //   });
  //   return this.http.post<any>(this.API_URL_R, jsonData, { headers });
  // }
  // getEmployeesRoleFromServer(): Observable<Employee_Roles[]> {
  //   return this.http.get<Employee_Roles[]>(this.API_URL_R);
  // } 
   getEmployeeRolesFromServer(id: number): Observable<Employee_Roles[]> {
    return this.http.get<Employee_Roles[]>(`${this.API_URL_E_R}/${id}`);
  }

  // registerEmployeeRole(emp: Employee_Roles): Observable<Employee_Roles> {
  //   return this.http.post<Employee_Roles>(this.API_URL_R, emp);
  // }
  // getEmployeeRoleById(id: number): Observable<Employee_Roles> {
  //   const headers = new HttpHeaders({
  //     "Content-Type": "application/json",
  //   });

  //   return this.http.get<Employee_Roles>(`${this.API_URL_R}/${id}`, { headers });
  // }

  getRoles(): Observable<Role[]>{
    return this.http.get<Role[]>(this.API_URL_R);
  }

}
