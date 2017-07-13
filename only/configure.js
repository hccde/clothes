let cheerio = require('cheerio');
let utils = require('../lib/utils');
let request = require('../lib/request');
let globalConfig = require('../configure');

let logFile = globalConfig.logFile;
let warningLimit = 20,warningCount=0,_currentPage=-40,_totalPage = 200;
module.exports = {
	all:{
		url:'http://www.only.cn/webapp/wcs/stores/servlet/CategoryNavigationResultsView',
		get totalPage(){
			return _totalPage;
		},
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
			orderBy:5,
			categoryId:'',
			get beginIndex(){
				_currentPage+=40;
				return _currentPage;
			}
		},
		get currentPage(){
			return _currentPage
		},
		handler(str){
			let $ = cheerio.load(str);
			let res = [];
			try{
			$('.pageContainerList .HfloorTwoList >li').each((index,el)=>{
				_totalPage = parseInt($('.pageNumbers .fl').text().trim());
				let div = $(el).find('.HfloorTwoListTitle').find('a');
				let title = div.text().trim();
				let href = div.attr('href');
				let img = $(el).find('.HfloorTwoListImg').find('img').data('original');
				let price = parseFloat($(el).find('p').text().trim().split('¥').pop().trim());
				let id = $(el).find('.quickLook a hidden').attr('value');
				res.push({
					name:title,
					href:href,
					img:img,
					desc:title,
					price:Number(price),
					sex:0,
					type:0,
					sale:-1,
					id:id
				})
			})
			return res;
			}catch(e){
				logFile.warn('only page has changed,some class selector failed');
					warningCount++;
					if(warningCount>=warningLimit){
						logFile.error('only page must be re-anlaysis');
						request.kill('onlu');						
					}
				return -1;
			}
		}
	},
	concurrency:20
}