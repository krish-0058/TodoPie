const jwt = require("jsonwebtoken")
const secret = "todopie1234//"


function checkForCookie(cookieName){
    return(req,res,next)=>{
        const token = req.cookies["token"]
        if(!token){
            return next()
        }
        else{
            try{
                const userPayload = jwt.verify(token,secret)
                req.user = userPayload
            }
            catch(err){
                console.log(err)
            }
            next()
        }
    }
}





module.exports = {checkForCookie}