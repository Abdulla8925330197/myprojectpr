
import { createDepartment } from "../../services/departmentService";

jest.mock("@prisma/client", () => {
  const mPrisma = {
    department: {
      create: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrisma) };
});
import { PrismaClient } from "@prisma/client";


describe("Department Service - createDepartment", () => {
  let prisma: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    prisma = new PrismaClient() as unknown as jest.Mocked<PrismaClient>;
    jest.clearAllMocks();
  });

  it("should create a department", async () => {
    const departmentData = { name: "HR" };
    const createdDepartment = { id: 1, name: "HR" };

    (prisma.department.create as jest.Mock).mockResolvedValue(createdDepartment);

    const result = await createDepartment(departmentData);

    expect(prisma.department.create).toHaveBeenCalledWith({ data: departmentData });
    expect(result).toEqual(createdDepartment);
  });

  it("should throw error if prisma fails", async () => {
    const departmentData = { name: "Finance" };

    (prisma.department.create as jest.Mock).mockRejectedValue(new Error("DB error"));

    await expect(createDepartment(departmentData)).rejects.toThrow("DB error");
    expect(prisma.department.create).toHaveBeenCalledWith({ data: departmentData });
  });
});
