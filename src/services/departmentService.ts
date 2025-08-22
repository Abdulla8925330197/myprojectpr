  import { PrismaClient } from "@prisma/client";
import {Department} from "../dto/departmentDto"
const prisma = new PrismaClient();

export const createDepartment = async (data:Department)=>{
    return prisma.department.create({data})
}