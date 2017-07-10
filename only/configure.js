let cheerio = require('cheerio');
let utils = require('../lib/utils');
let request = require('../lib/request');
let globalConfig = require('../configure');

let logFile = globalConfig.logFile;
let warningLimit = 20,warningCount=0,currentPage=-40;
module.exports = {
	all:{
		url:'http://www.only.cn/webapp/wcs/stores/servlet/CategoryNavigationResultsView',
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
					price:price
				})
			})
			}catch(e){
				logFile.warn('uniqlo page has changed,some class selector failed');
					warningCount++;
					if(warningCount>=warningLimit){
						logFile.error('only page must be re-anlaysis');
						request.kill('onlu');						
					}
				return -1;
			}
			console.log(res);
		}
	},
	concurrency:20
}