//employee.model.ts
export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  startDate: Date;
  birthDate: Date;
  // gender: string;
  gender: number;
  // roles!: Role[];
  status: boolean;
  //=========

  // id: number=1
  // firstName: string="ראובן";
  // lastName: string="שמעוני";
  // startDate: Date=new Date();
  // birthDate: Date=new Date();
  // gender: string="gender";
  // roles!: Role[];


}

export interface Role {
  id: number;
  name: string;
  isManager: boolean;
  // startDate!: Date;

  // constructor(name: string, isManager: boolean) {
  //   this.name=name;
  //   this.isManager=isManager;
  //   // this.startDate=startDate;
  // }
}
export interface Employee_Roles {
  Id: number;
  RoleId: number;
  EmployeeId: number;
  RoleStartDate: Date;
}