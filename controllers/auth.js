const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  const user = await User.create(req.body);
   const token  = user.createJWT()
  res.status(StatusCodes.CREATED).send({
    token,
    user: {
      name: user.name,
    },
  });
};

const login = async (req, res) => {
  const {email, password} = req.body;
  if(!email || !password){
    throw new BadRequestError("Please provide email or password")
  }
  //check for user
  //if user is not there 
  const user  = await User.findOne({email});
  if(!user){
    throw new UnauthenticatedError("Invalid Credentials")
  }

  const isPasswordMatch = await user.checkPassword(password)
  
  if(!isPasswordMatch){
   throw new UnauthenticatedError("Invalid credentials")
  }

  const token  = user.createJWT()
  return res.status(StatusCodes.OK).json({
    token, user: {
      name: user.name
    }
  })

};

module.exports = {
  register,
  login,
};
