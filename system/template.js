
var cache = {};
var TEMPLATE_PATH = $mappath('templates');
var LAYOUT_PATH = TEMPLATE_PATH + '/layout.html';
var layoutTemplate = clearBlank(Fs.readText(LAYOUT_PATH));
module.exports = function(name, data){
	switch(name){
		case 'detail': return detail(data);
		case 'list': return list(data);
		case 'other': return other(data);
		
	}
};

function detail(data){
	
	if(!cache.detail){
		cache.detail = true;
		$require('xcode.js');
		$require('showdown.js');

	}
	var text = $markdown($xcode(data.text)); //markdown解析
	text = text.replace(/(<(textarea|pre)[^>]*>[\w\W]+?<\/\2>)|(\n+)|(\s{2,})|<script>([\w\W]+?)<\/script>/g, function(m0, textcode, codetag, newline, space, jscode){
		if(newline)return '';
		if(space)return ' ';
		if(jscode){
			return '<script>' + Packer.pack(jscode) + '</script>';
		}
		return m0;
	}); //压缩

	$template = {
		main: 'post.html'
	};

	$data = {
		title: data.info.title,
		tags: data.info.tags,
		content: text

	};
	return Zero.getContent({
		text: layoutTemplate,
		path: LAYOUT_PATH
	});


}

function list(data){
	if(!cache.list){
		cache.list = true;
		cache.categoryHash = function(Category){
			var hash = {};
			Category.forEach(function(item, i){
				hash[item.id] = item.text;
			});
			return hash;
		}(CONFIG.Category);
	}
	var category = data.category;
	$template = {
		main: 'list.html'
	};

	$data = {
		title: '前端开发',
		categoryText: cache.categoryHash[category] || 'Index',
		listContent: function(listdata){
			var content = [];
			if(listdata){
				listdata.forEach(function(post, i){
					content.push('<li><a href="post/'+post.id+'.html">'+post.title+'</a>'+ function(tags){
						return '';
						if(tags.length){
							var html = [];
							tags.forEach(function(tagName){
								html.push('<a href="/tags.html#'+tagName+'">'+tagName+'</a>');
							});
							return '<span class="tags">'+html.join(',')+'</span>';
						}else{
							return'';
						}
					}(post.tags)+'<span>'+ formatDate(post.lastmodified) +'</span></li>');
				});
				
				
				
			}else{
				content.push('<li class="none">暂无日志</li>');
			}
			return content.join('');
			
			function formatDate(ms){
				var d = new Date(ms);
				return [d.getFullYear(), d.getMonth()+1, d.getDate()].join('-').replace(/-(\d)\b/g, '-0$1');
			}
		
		}(data.list)

	};
	
	return Zero.getContent({
		text: layoutTemplate,
		path: LAYOUT_PATH
	});
	
	
}

function other(data){
	$data = {
		categoryText: data.text
	};
	$template = {
		main: data.id +'.html'
	};
	return Zero.getContent({
		text: layoutTemplate,
		path: LAYOUT_PATH
	});
}

function clearBlank(str){
	return str.replace(/>\s+</g, '><');
}