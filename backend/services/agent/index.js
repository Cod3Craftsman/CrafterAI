import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
dotenv.config()

const port = process.env.PORT
const app = express()
app.use(express.json())

app.get("/" , (req , res) => {
  res.json({message : "Hello from Agent!"})
})

app.listen(port , () => {
  console.log(`Agent Started at port: ${port}`)
  connectDb()
})