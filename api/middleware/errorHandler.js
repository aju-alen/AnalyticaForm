export const errorHandler =(error,req,res,next)=>{
    const errorStatus = error.status || 500
    const errorMessage = error.message || "Something went wrong"
    
    return res.status(errorStatus).send(errorMessage)
  }