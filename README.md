
##custNews

***

*用node.js写的简单的爬虫工具，来获取[长春理工大学官网](http://www.cust.edu.cn)里的理工新闻，保存在本地文件中。*

**需要的依赖**

    var http = require('http');

    var cheerio = require('cheerio');

    var fs = require('fs');

    var request = require('request');


**核心代码**

`getStart : function(url){`
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
    }

