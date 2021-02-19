const UserModel = require("./schema")
const express = require("express")

const usersRouter = express.Router()

usersRouter.post("/register", async (req, res, next) => {
    try {
      const newUser = new UserModel(req.body)
      console.log('new user', req.body)
      const { _id } = await newUser.save()
  
      res.status(201).send(_id)
    } catch (error) {
      next(error)
    }
})

usersRouter.post("/login", async (req, res, next) => {
  try {
    
  } catch (error) {
    console.log(error)
    next(error)
  }
})

usersRouter.get("/refreshToken", async (req, res, next) => {
    try {
     
  
    } catch (error) {
      next(error)
    }
  })

usersRouter.post("logout", async(req, res, next) => {
    try{

    } catch(error){
        console.log(error);
        next(error)
    }
})

module.exports = usersRouter