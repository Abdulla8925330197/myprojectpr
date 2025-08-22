import { PrismaClient, Prisma } from "@prisma/client";
import { Employee, EmployeeFilterDto } from "../dto/employeeDto";

const prisma = new PrismaClient();


export const createEmployee = async (data: Employee) => {

  const departmentExists = await prisma.department.findUnique({
    where: { id: data.departmentId }
  });
  if (!departmentExists) {
    throw new Error(`Department with ID ${data.departmentId} does not exist`);
  }

  return prisma.employee.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      salary: new Prisma.Decimal(data.salary), // Decimal handling
      joinDate: new Date(data.joinDate),
      department: {
        connect: { id: data.departmentId }
      }
    },
    include: {
      department: { select: { id: true, name: true } }
    }
  });
};


export const getEmployees = async (filters: EmployeeFilterDto) => {
  const {
    page = "1",
    limit = "10",
    sortBy = "id",
    sortOrder = "asc",
    departmentId,
    minSalary,
    maxSalary,
    lastName,
    firstName,
  } = filters;

  const pageNumber = parseInt(page);
  const pageSize = parseInt(limit);

  const where: Prisma.EmployeeWhereInput = {};

  
  if (departmentId) {
    where.departmentId = Number(departmentId);
  }


  if (minSalary || maxSalary) {
    where.salary = {};
    if (minSalary) (where.salary as Prisma.DecimalFilter).gte = new Prisma.Decimal(minSalary);
    if (maxSalary) (where.salary as Prisma.DecimalFilter).lte = new Prisma.Decimal(maxSalary);
  }


  if (firstName || lastName) {
    where.OR = [];
    if (firstName) where.OR.push({ firstName: { contains: firstName } });
    if (lastName) where.OR.push({ lastName: { contains: lastName } });
  }

 
  const totalItems = await prisma.employee.count({ where });

  
  const employees = await prisma.employee.findMany({
    where,
    skip: (pageNumber - 1) * pageSize,
    take: pageSize,
    orderBy: { [sortBy]: sortOrder as Prisma.SortOrder },
    include: {
      department: { select: { id: true, name: true } }
    }
  });

  return {
    meta: {
      page: pageNumber,
      limit: pageSize,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize)
    },
    data: employees
  };
};
