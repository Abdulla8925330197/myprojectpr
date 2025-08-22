import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {

  await prisma.department.createMany({
    data: [
      { name: "CSE" },
      { name: "ECE" },
      { name: "EEE" },
      { name: "CIVIL" },
      { name: "MECHANICAL" }
    ]
  });

  
  const departments = await prisma.department.findMany();

  await prisma.employee.createMany({
    data: [
      {
        firstName: "Mohamed",
        lastName: "Abdulla",
        email: "abd@gmail.com",
        joinDate: new Date("2025-02-11"),
        departmentId: departments[0].id, 
        salary: 50000.05
      },
      {
        firstName: "vini",
        lastName: "kumaru",
        email: "vini@gmail.com",
        joinDate: new Date("2024-08-21"),
        departmentId: departments[1].id, 
        salary: 60000.04
      },
      {
        firstName: "tilesh",
        lastName: "kumar",
        email: "tilesh@gmail.com",
        joinDate: new Date("2023-12-15"),
        departmentId: departments[2].id, 
        salary: 55000.03
      },
       {
        firstName: "jameel",
        lastName: "ahamed",
        email: "jameel@gmail.com",
        joinDate: new Date("2023-05-15"),
        departmentId: departments[3].id, 
        salary: 55000.01
      },
       {
        firstName: "tamil",
        lastName: "anban",
        email: "tamil@gmail.com",
        joinDate: new Date("2023-11-15"),
        departmentId: departments[4].id, 
        salary: 55000.02
      }
    ]
  });

  console.log("Departments & Employees seeded successfully!");
}

main()
  .catch((err) => {
    console.error(" Error seeding data:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
