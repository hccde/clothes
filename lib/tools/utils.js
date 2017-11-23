module.exports = {
    fnN(n,fn){
        let counter = 1;
        return ()=>{
            counter === n ? fn():(counter+=1);
        }
    }
};