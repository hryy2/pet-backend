//not found

const notFound=(req,resp,next)=>{
    const error= new Error(`Not Found: ${req.originalUrl}`)
    resp.status(404);
    next(error);
}

//error handler

const errorHandler=(err,req,res,next)=>
{
    const statusCode=res.statusCode==200?500:res.statusCode
    res.status(statusCode)
    res.json({
        message:err.message,
        stack:err?.stack,
    })
}

module.exports={errorHandler,notFound}