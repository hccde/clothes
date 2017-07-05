let cheerio = require('cheerio');
let utils = require('../lib/utils');
let request = require('../lib/request');
let globalConfig = require('../configure');

let logFile = globalConfig.logFile;
let warningLimit = 20,warningCount=0,currentPage=1;
module.exports = {
	all:{
		url:`http://www.uniqlo.cn/search.htm?search=y&viewType=grid&orderType=_newOn`,
		method:'get',
		params:{
			get pageNum(){
				return currentPage++
			}
		},
		totalPage:1,
		currentPage:currentPage,
		handle(str){
			let $ =	cheerio.load(str);
			let pageInfo  = $('.page-info').text().split('/');
			let goodsData = [];
			if( utils.vaild('error','lack totalPage info',()=>{
				return pageInfo.length == 2 || !isNaN(Number(pageInfo[1]))
			}) ){
				this.totalPage = Number(pageInfo[1]);
				let goods = [];
				try{
					goods = $('.shop-list').find('li');
					goods.map((index, el) => {
						let aele = $(el).find('.pic a')[0];
						let desc = $(el).find('.desc')[0];
						let price = $(el).find('.price strong')[0];
						let saleAmount = $(el).find('.sales-amount em');
						let data = {
							href: $(aele).attr('href'),
							img: $(aele).find('img').attr('src'),
							desc: $(desc).text().trim(),
							price: $(price).text(),
							sale: $(saleAmount).text()
						}
						goodsData.push(data);
						return data;
					})
					console.log(goodsData)
					//clear counter
					warningCount = 0;
				}catch(e){
					logFile.warn('uniqlo page has changed,some class selector failed');
					warningCount++;
					if(warningCount>=warningLimit){
						logFile.error('uniqlo page must be re-anlaysis');
						request.kill('uniqlo');						
					}
					return -1;
				}
			}else{
				request.kill('uniqlo');
				return -1;
			}
			return goodsData;			
		}
	},
	concurrency:3
}