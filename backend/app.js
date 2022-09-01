const express = require("express")
const app = express()
const {Pool} = require("pg")
require("dotenv").config()

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT
})

app.listen(5000, () => {
    console.log("Listening on port 5000...")
})