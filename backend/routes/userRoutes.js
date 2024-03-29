import express from "express";
import expressAsyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import {generateToken, isAuth} from "../utils.js";

const userRouter = express.Router();

userRouter.post("/signin",
  expressAsyncHandler(async (req, res) => {
    // console.log(req.body);
    const user = await User.findOne({ email: req.body.email });
    // console.log(user);
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          jwtToken: generateToken(user),
        });
        return;
      }
    }

    res.status(401).send({ message: "invalid email or password" });
  })
);

userRouter.post("/signup",
  expressAsyncHandler(async (req, res) => {
    console.log(req.body);
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    });
    const user = await newUser.save();
    // console.log(user);
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      jwtToken: generateToken(user),
    });
  })
);

userRouter.put("/profile",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    // console.log(req.body);
    const user =  await User.findById(req.user._id)
    if(user){
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email
      if(req.body.password){
        user.password = bcrypt.hashSync(req.body.password, 8)
      }
      const updatedUser = await user.save();
      // console.log(user);
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        jwtToken: generateToken(updatedUser),
      });

    }
    else{
      res.status(404).send({message: 'User not found'})
    }
  })
);

export default userRouter;
