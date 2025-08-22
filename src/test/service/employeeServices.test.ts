
import { Prisma } from "@prisma/client";
import * as employeeService from "../../services/employeeService";


jest.mock("@prisma/client", () => {
  const actual = jest.requireActual("@prisma/client"); // keep real Prisma types
  const mPrisma = {
    department: { findUnique: jest.fn() },
    employee: { create: jest.fn(), count: jest.fn(), findMany: jest.fn() },
  };
  return {
    ...actual,
    PrismaClient: jest.fn(() => mPrisma),
  };
});

import { PrismaClient } from "@prisma/client"; // after mock
const prisma = new PrismaClient();

describe("Employee Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createEmployee", () => {
    it("should create an employee when department exists", async () => {
      const data = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        salary: "50000",
        joinDate: new Date("2025-08-19"),
        departmentId: 1,
      };

      (prisma.department.findUnique as unknown as jest.Mock).mockResolvedValue({
        id: 1,
        name: "HR",
      });

      (prisma.employee.create as unknown as jest.Mock).mockResolvedValue({
        id: 1,
        ...data,
        department: { id: 1, name: "HR" },
      });

      const result = await employeeService.createEmployee(data as any);

      expect(prisma.department.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prisma.employee.create).toHaveBeenCalled();
      expect(result.department).toEqual({ id: 1, name: "HR" });
    });

    it("should throw error when department does not exist", async () => {
      const data = {
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@example.com",
        salary: "60000",
        joinDate: new Date("2025-08-19"),
        departmentId: 2,
      };

      (prisma.department.findUnique as unknown as jest.Mock).mockResolvedValue(null);

      await expect(employeeService.createEmployee(data as any)).rejects.toThrow(
        "Department with ID 2 does not exist"
      );
    });
  });

  describe("getEmployees", () => {
    it("should return employees with pagination and filters", async () => {
      const filters = {
        page: "1",
        limit: "2",
        departmentId: "1",
        sortBy: "id",
        sortOrder: "asc",
      };

      (prisma.employee.count as unknown as jest.Mock).mockResolvedValue(2);

     
      const employeeData = [
        {
          id: 1,
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          salary: new Prisma.Decimal("50000"),
          joinDate: new Date("2025-08-19"),
          department: { id: 1, name: "HR" },
        },
        {
          id: 2,
          firstName: "Jane",
          lastName: "Smith",
          email: "jane@example.com",
          salary: new Prisma.Decimal("9000"),
          joinDate: new Date("2025-08-19"),
          department: { id: 1, name: "HR" },
        },
      ];

      (prisma.employee.findMany as unknown as jest.Mock).mockResolvedValue(employeeData);

      const result = await employeeService.getEmployees(filters as any);

      expect(prisma.employee.count).toHaveBeenCalledWith({
        where: { departmentId: 1 },
      });
      expect(prisma.employee.findMany).toHaveBeenCalled();
      expect(result.meta.totalItems).toBe(2);
      expect(result.data.length).toBe(2);
    });

    it("should handle empty results", async () => {
      const filters = { page: "1", limit: "5" };

      (prisma.employee.count as unknown as jest.Mock).mockResolvedValue(0);
      (prisma.employee.findMany as unknown as jest.Mock).mockResolvedValue([]);

      const result = await employeeService.getEmployees(filters as any);

      expect(result.meta.totalItems).toBe(0);
      expect(result.data).toEqual([]);
    });
  });
});
