import {z} from "zod";

export const createDepartment=z.object({
    body:z.object({
        name:z.string().min(2)
    })
})
export type createDepartments=z.infer<typeof createDepartment>["body"]