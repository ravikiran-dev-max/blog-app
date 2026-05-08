import exp from 'express'
import {connect} from 'mongoose'
import {config} from 'dotenv'
import {userApp} from './APIs/UserApi.js'
import {authorApp} from './APIs/AuthorApi.js'
import {adminApp} from './APIs/AdminApi.js'
import {commonApp} from './APIs/CommonApi.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

config()
const app=exp()
//add cookie parser middleware
app.use(cookieParser())
//add cors middleware
//add cors middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}))
//body parser middleware
app.use(exp.json())
//path level middlewares
app.use("/user-api",userApp)
app.use("/author-api",authorApp)
app.use("/admin-api",adminApp)
app.use("/auth",commonApp)
//connect to db
const connectDB=async()=>{
    try{
        await connect(process.env.DB_URL)
        console.log("DB connected")
        //assign port
        const port=process.env.PORT || 6000
        app.listen(port,()=> console.log(`Server listening on ${port}....`))
    }
    catch(err){
        console.log("Error in connecting to database:",err)
    }
}

connectDB()

//to handle invalid path
app.use((req,res,next)=>{
    res.status(404).json({message:`path ${req.url} is invalid`})
})

//Error handling middleware
app.use((err, req, res, next) => {
  console.log("Error message:", err.message);
  console.log("Error name:", err.name);
  console.log("Error code:", err.code);
  console.log("Error cause:", err.cause);
  console.log("Full error:", JSON.stringify(err, null, 2));
  
  //ValidationError
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: "error occurred", error: err.message });
  }
  //CastError
  if (err.name === "CastError") {
    return res.status(400).json({ message: "error occurred", error: err.message });
  }
  const errCode = err.code ?? err.cause?.code ?? err.errorResponse?.code;
  const keyValue = err.keyValue ?? err.cause?.keyValue ?? err.errorResponse?.keyValue;

  if (errCode === 11000) {
    const field = Object.keys(keyValue)[0];
    const value = keyValue[field];
    return res.status(409).json({
      message: "error occurred",
      error: `${field} "${value}" already exists`,
    });
  }

  //send server side error
  res.status(err.status || 500).json({ message: "error occurred", error: err.message || "Server side error", fullError: err });
});