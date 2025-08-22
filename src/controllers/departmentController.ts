import express from "express";
import { Request,Response } from "express";

import * as departmentService from "../services/departmentService";

export const createDepartments = async(req:Request,res:Response)=>{
    try{
const department = await departmentService.createDepartment(req.body);
res.status(201).json(department);
    }catch{
res.status(500).json({message:"failed to create department"})
    }
}

