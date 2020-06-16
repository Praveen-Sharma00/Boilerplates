import Response from '../utils/Response'

function sendDevError(res,err){
    Response.error(res,'Some error occurred !',err,err.statusCode)
}



// function handleValidationError(req,err){
//
//     let errMsg = err.errors.map((e) =>{
//         return {
//             field:e['properties'][]
//         }
//     })
// }
export default (err,req,res,next) => {
    err.statusCode  = err.statusCode || 500
    err.status = err.status || 'error'

    if(process.env.NODE_ENV === 'development'){
        sendDevError(res,err)
    }
    else if(process.env.NODE_ENV === 'production'){
        if(err.hasOwnProperty('errors') && Object.values(err.errors).length>0)
            Response.error(res,'Some error occurred',err)
    }
}