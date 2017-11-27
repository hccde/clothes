let Hm = require('./shops/hm.js');
let Only = require('./shops/only.js');
let Uniqlo = require('./shops/uniqlo.js');
let Veromoda = require('./shops/veromoda.js');
let Zara = require('./shops/zara.js');
const time = 12*3600*1000;

setInterval(()=>{
    new Hm().run();
},time)
setInterval(()=>{
    new Zara().run();
},time)
setInterval(()=>{
    new Uniqlo().run();
},time)
setInterval(()=>{
    new Veromoda().run();
},time)
setInterval(()=>{
    new Only().run();
},time)

