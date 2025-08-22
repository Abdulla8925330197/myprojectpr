
import { Request, Response } from "express";
import {
  createEmployeeController,
  getEmployeesController,
} from "../../controllers/employeeController";
import * as employeeService from "../../services/employeeService";

jest.mock("../../services/employeeService");

describe("Employee Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

 
  describe("createEmployeeController", () => {
    it("should return 400 if departmentId is missing", async () => {
      mockRequest.body = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        salary: "5000",
        joinDate: "2025-01-01",
        
      };

      await createEmployeeController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "departmentId is required",
      });
    });

    it("should create employee and return 201", async () => {
      const employeeData = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        salary: "5000",
        joinDate: "2025-01-01",
        departmentId: 1,
      };
      mockRequest.body = employeeData;

      (employeeService.createEmployee as jest.Mock).mockResolvedValue(employeeData);

      await createEmployeeController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(employeeService.createEmployee).toHaveBeenCalledWith(employeeData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "employee is created",
        employee: employeeData,
      });
    });

    it("should handle service error and return 500", async () => {
      const employeeData = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        salary: "5000",
        joinDate: "2025-01-01",
        departmentId: 1,
      };
      mockRequest.body = employeeData;

      (employeeService.createEmployee as jest.Mock).mockRejectedValue(
        new Error("DB error")
      );

      await createEmployeeController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "DB error",
      });
    });
  });

  
  describe("getEmployeesController", () => {
    it("should return employees with status 200", async () => {
      const filters = { firstName: "John" };
      mockRequest.query = filters;

      const mockResult = [
        {
          id: 1,
          firstName: "John",
          lastName: "Doe",
          departmentId: 1,
        },
      ];
      (employeeService.getEmployees as jest.Mock).mockResolvedValue(mockResult);

      await getEmployeesController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(employeeService.getEmployees).toHaveBeenCalledWith(filters);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
    });

    it("should handle service error and return 500", async () => {
      mockRequest.query = { firstName: "John" };

      (employeeService.getEmployees as jest.Mock).mockRejectedValue(
        new Error("DB error")
      );

      await getEmployeesController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Failed to fetch employees",
      });
    });
  });
});
