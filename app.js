/**
 * 一个小小的node爬虫程序。可以获取http://www.cust.edu.cn
 * 里面的理工新闻栏目下的文章，标题和文章内容会以txt文件
 * 保存到/data目录下，文章中的图片会保存在/images目录下。
 */
var http = require('http');
var cheerio = require('cheerio');
var fs = require('fs');
var request = require('request');


/**
 * 抓取http://www.cust.edu.cn/的理工新闻
 * @type
 */
var cust = {
	/**
	 * 获取url里的数据
	 * @param  {[type]}   url      [获取url]
	 * @param  {Function} callback [回调函数]
	 * @return {[type]}            [null]
	 */
	download : function(url, callback){
		http.get(url, function(res){
			var data = '';
			res.setEncoding('utf-8');
			res.on('data', function(chunk){
				data += chunk;
			});
			res.on('end', function(){
				callback(data);
			});
			res.on('error', function(err){
				if(err) throw err;
				callback(null);
			});
		});
	},
	/**
	 * 开始执行爬虫
	 * @param  {[type]} url [获取url]
	 * @return {[type]}     [null]
	 */
	getStart : function(url){
		cust.download(url, function(d){
			if(d){
				var $ = cheerio.load(d);
				var title = $('#main3 h3').text().trim();
				var publishTime = $('#author').text().trim().split('|')[0].split('：')[1];
				var content = $('#work p').text();
				var img = $('#work img');
				cust.saveImg($, img);
				cust.saveContent(publishTime+content, title);
			}
		});
	},
	/**
	 * 保存获取到的内容
	 * @param  {[type]} content [文章内容]
	 * @param  {[type]} title   [文章标题]
	 * @return {[type]}         [null]
	 */
	saveContent : function(content, title){
		fs.appendFile('./data/' + title + '.txt', content, 'utf-8', function(err){
			if(err) throw err;
		});
	},
	/**
	 * 保存文章中的图片
	 * @param  {[type]} $   [cheerio对象]
	 * @param  {[type]} img [图片对象]
	 * @return {[type]}     [null]
	 */
	saveImg : function($, img){
		img.each(function(i, e){
			var imgUrl = 'http://www.cust.edu.cn' + $(this).attr('src').substr(2);
			var imgname = imgUrl.split('/')[6];
			request.head(imgUrl, function(err, res, body){
				if(err) throw err;
			});
			request(imgUrl).pipe(fs.createWriteStream('./images/'+imgname));
		});
	}
};

var baseUrl = 'http://www.cust.edu.cn/lgxw/';
var numStart = 21821;
var numEnd = 24250;
for(var i=numStart; i<=numEnd;i++){
	cust.getStart(baseUrl+i+'.htm');
}