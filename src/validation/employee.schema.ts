import {z} from "zod";

export const createEmployee = z.object({
    body:z.object({
firstName:z.string().min(2),
lastName:z.string().min(2),
email:z.email(),
salary:z.number().positive(),
joinDate:z.coerce.date(),
departmentId:z.number().int()
    })
})

export type createEmployees = z.infer<typeof createEmployee>["body"]

