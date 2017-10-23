let uniqlo = require('./uniqlo');
let hm = require('./hm');
let zara = require('./zara');
let vero = require('./veromoda');
let only = require('./only');
let utils = require('./lib/utils');
// only.run();
// vero.run();
// zara.run();
// hm.run();
// uniqlo.run()

// setTimeout(()=>{vero.run()},0);
setTimeout(()=>{hm.run()},0);
// setTimeout(()=>{zara.run()},0);
// setTimeout(()=>{only.run()},0);
// setTimeout(()=>{uniqlo.run()},0);

utils.updateDaily();