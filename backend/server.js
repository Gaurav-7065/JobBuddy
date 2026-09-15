import app from "./src/app.js"
import dotenv from "dotenv"
import Connect_Db from "./src/config/database.js";

dotenv.config();

Connect_Db()

app.listen(3000,()=>{
    console.log("Server is running on port 3000 ")
})   