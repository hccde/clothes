let Hm = require('./shops/hm.js');
let Only = require('./shops/only.js');
let Uniqlo = require('./shops/uniqlo.js');
let Veromoda = require('./shops/veromoda.js');
let Zara = require('./shops/zara.js');
const time = 12*3600*1000;

function run(){
    return [Hm,Zara,Uniqlo,Veromoda,Only].map((item)=>{
        if(process.env.NODE_ENV !== 'dev'){
            setInterval(()=>{
                new item().run();
            },time);
        }else{
            setTimeout(()=>{
                new item().run();
            },0)
        }
        return item;
    });
}

run();

