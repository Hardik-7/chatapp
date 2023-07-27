const User = require('../model/user.model')
// const Validator = require('validatorjs');
const catchAsync = require('../utils/catchAsync')

exports.signup = catchAsync(async (req, res, next) => { 
    const { username, password, name } = req.body
    if(!username || !password || !name){
      return next({statusCode:400, message:"Please enter valid data!"})
    }
    const isExist = await User.findOne({username:username})
    if(isExist){
        return next({statusCode:401, message: "This username already has been taken"}) 
    }
    const user = await User.create(req.body)
    res.status(201).json({
        success:true,
        message:"Sign up successfully",
        date:user,
        token: user.getJwtToken()
    })    
})

exports.signin = catchAsync(async (req, res, next) => {
    const { username, password } = req.body
    if(!username || !password ){
        return next({statusCode:400, message:"Please Enter valid data !"})
    }
    const user = await User.findOne({username:username}).select('+password')
    if(!user){
        return next({statusCode:403, message: "Invalid username or password"}) 
    }
    if(!(await user.comparePassword(password))){
        return next({statusCode:403, message: "invalid password"}) 
    }
    res.status(201).json({
        success:true,
        message:"Sign in successfully",
        date:user,
        token: user.getJwtToken()
    })   
})

