function field(callback){
    return function checker(...param){
        return (param.length == 3) ?
            callback(null, ...param) : callback(...param)
    }
}

export default {
    Query: ()=> ({
        test: field((parent, { /* argument */ }, { /*context */} )=>{
            
        })
    }),

    Mutation: ()=>({
        test: field((parent, { /* argument */ }, { /*context */} )=>{
            
        })
    })
}