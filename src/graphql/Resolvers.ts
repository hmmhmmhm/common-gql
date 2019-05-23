function field(callback){
    return function checker(...param){
        return (param.length == 3) ?
            callback(null, ...param) : callback(...param)
    }
}

export default {
    Query: ()=> ({
        some: field((parent, { /* argument */ }, { /*context */} )=>{
            //
        })
    }),

    Mutation: ()=>({
        some: field((parent, { /* argument */ }, { /*context */} )=>{
            //
        })
    })
}