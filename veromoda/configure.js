let cheerio = require('cheerio');
let utils = require('../lib/utils');
let request = require('../lib/request');
let globalConfig = require('../configure');

let logFile = globalConfig.logFile;
let warningLimit = 20,warningCount=0,currentPage=-40;
module.exports = {
	all:{
		url:'http://www.veromoda.com.cn/cn/vmstore/sysp.html',
		totalPage:100,
		params:{
			manufacturer:'',
			searchType:'',
			resultCatEntryType:'',
			searchTerm:'',
			catalogId:10001,
			categoryId:-30,
			langId:-7,
			storeId:10151,
			sType:'SimpleSearch',
			filterFacet:'',
			metaData:'',
			facet:'',
			facet:'',
			facet:'',
			subCategoryId:'',
			occasionFacet:'',
			colorFacet:'',
			sizeFacet:'',
			sizeflag:'',
			colorflag:'',
			occasionflag:'',
			pageSize:40,
			// beginIndex:0,
			orderBy:5,
			categoryId:'',
			get beginIndex(){
				currentPage+=40;
				return currentPage;
			}
		},
		currentPage:currentPage,
		handler(str){
			let $ = cheerio.load(str);
			let res = [];
			try{
			$('.pageContainerList .HfloorTwoList >li').each((index,el)=>{
				totalPage = parseInt($('.pageNumbers .fl').text().trim());
				let div = $(el).find('.HfloorTwoListTitle').find('a');
				let title = div.text().trim();
				let href = div.attr('href');
				let img = $(el).find('.HfloorTwoListImg').find('img').data('original');
				let price = $(el).find('p').text().trim().split('¥').pop().trim();
				res.push({
					name:title,
					href:href,
					img:img,
					desc:title,
					price:Number(price),
					sex:0,
					type:0,
					sale:-1
				})
			})
			return res;
			}catch(e){
				logFile.warn('veromoda page has changed,some class selector failed '+e.toString());
					warningCount++;
					if(warningCount>=warningLimit){
						logFile.error('veromoda page must be re-anlaysis');
						request.kill('vero');						
					}
				return -1;
			}
		}
	},
	concurrency:20
}