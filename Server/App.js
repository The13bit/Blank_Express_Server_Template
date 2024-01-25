import  express  from "express";
import {config} from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import ErrorMiddleware from "./middleware/Error.js";
//routes import







config({
    path:"./Config/config.env"
})

const app=express();

//middleware
app.use(express.json());
app.use(cors({credentials:true,origin:"http://localhost:3000"})); //change to frontend address
app.use(cookieParser());


//routes

//app.use("/api/data",apirouter);


export default app;

app.use(ErrorMiddleware)