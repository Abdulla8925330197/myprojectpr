



export interface Employee {
  firstName: string;
  lastName: string;
  email: string;
  salary: string; 
  joinDate: string; 
  departmentId: number; 
}


export interface EmployeeFilterDto {
  page?: string; 
  limit?: string; 
  sortBy?: string; 
  sortOrder?: "asc" | "desc"|"joinDate"|"endDate";
  departmentId?: string;
  minSalary?: string;
  maxSalary?: string;
  firstName?: string;
  lastName?: string;
}

