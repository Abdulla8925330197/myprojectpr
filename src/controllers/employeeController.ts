import { Request, Response } from "express";
import * as employeeService from "../services/employeeService";
import { Employee, EmployeeFilterDto } from "../dto/employeeDto";


export const createEmployeeController = async (req: Request, res: Response) => {
  try {
    const data: Employee = req.body;

    if (!data.departmentId) {
      return res.status(400).json({ message: "departmentId is required" });
    }

    const employee = await employeeService.createEmployee(data);
    res.status(201).json({message:"employee is created",employee});
  } catch (error: any) {
    console.error("Error creating employee:", error);
    res.status(500).json({ message: error.message || "Failed to create employee" });
  }
};


export const getEmployeesController = async (req: Request, res: Response) => {
  try {
    const filters: EmployeeFilterDto = req.query as any;
    const result = await employeeService.getEmployees(filters);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Failed to fetch employees" });
  }
};
