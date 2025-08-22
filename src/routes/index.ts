import express from "express";
import {createDepartments} from "../controllers/departmentController";
import {createEmployeeController,getEmployeesController} from "../controllers/employeeController";
import {validate} from "../middeleware/zodMiddeleware";
import {createDepartment} from "../validation/department.schema";
import {createEmployee} from "../validation/employee.schema"
const router=express();
//department
router.post("/postDep",validate(createDepartment),createDepartments);
//employee
router.get("/getEmp",getEmployeesController);
router.post("/postEmp",validate(createEmployee),createEmployeeController);
export default router;


