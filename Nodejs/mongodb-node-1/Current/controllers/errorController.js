
const sendDevError = (res,err)=>{
    return res.json({
        status:err.status,
        statusCode:err.statusCode,
        message:err.message,
        stack : err.stack,
    })
}
export default function(err,req,res,next){
    if(process.env.NODE_ENV === 'development'){
        sendDevError(res,err)
    }
    // else if(process.env.NODE_ENV === 'production'){
    //    
    // }
}