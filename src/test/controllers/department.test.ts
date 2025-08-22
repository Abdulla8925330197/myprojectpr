

import { createDepartments } from "../../controllers/departmentController";
import * as departmentService from "../../services/departmentService";
import { Request, Response } from "express";

jest.mock("../../services/departmentService");

describe("Department controller - createDepartments", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = { body: { name: "HR" } };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should create department and return 201", async () => {
    (departmentService.createDepartment as jest.Mock).mockResolvedValue({
      name: "HR",
    });

    await createDepartments(
      mockRequest as Request,
      mockResponse as Response
    );

    expect(departmentService.createDepartment).toHaveBeenCalledWith({ name: "HR" });
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({ name: "HR" });
  });

  it("should handle service error and return 500", async () => {
    (departmentService.createDepartment as jest.Mock).mockRejectedValue(
      new Error("DB Error")
    );

    await createDepartments(
      mockRequest as Request,
      mockResponse as Response
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "failed to create department",
    });
  });
});
