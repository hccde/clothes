// let uniqlo = require('./uniqlo');
// let hm = require('./hm');
// let zara = require('./zara');
// let vero = require('./veromoda');
// let only = require('./only');
// let utils = require('./lib/utils');
// only.run();
// vero.run();
// zara.run();
// hm.run();
// uniqlo.run()

// setTimeout(()=>{vero.run()},0);
// setTimeout(()=>{hm.run()},0);
// setTimeout(()=>{zara.run()},0);
// setTimeout(()=>{only.run()},0);
// setTimeout(()=>{uniqlo.run()},0);

// utils.updateDaily();
require('Promise');
let Consumer  = require('./lib/pattern/index');

// let consumer  = new Consumer(6);
// let t = 0
// async function add(t){
// 		console.log(t)
// 		if(t>20){
// 			await true;
// 			return;
// 		}
// 		await consumer.push(()=>{
// 			let time = 2000;
// 			return new Promise((resolve,reject)=>{
// 				setTimeout(()=>{
// 					console.log('a ',time);
// 					resolve();
// 				},time)
// 			})
// 		});
// 		t+=1
// 		add(t);
// 	}
// add(0);

let hm = require('./hm/index.js');

new hm().run();
