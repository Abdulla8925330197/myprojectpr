import express from "express";
import router from "./src/routes/index";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
const app = express();
const swaggerDocument =YAML.load("./docs/yaml")

app.use(express.json());
app.use()
app.use("/docs",swaggerUi.serve,swaggerUi.setup(swaggerDocument))
app.use("/api", router);
 //
//port 
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
    console.log(`swagger run at http://localhost:3000/docss`);
});
 