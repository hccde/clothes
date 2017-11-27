module.exports = {
    fnN(n,fn){
        let counter = 1;
        return ()=>{
            if(counter === n){
                fn();
                counter = 1;
            }else{
                counter += 1;
            }
        }
    }
};