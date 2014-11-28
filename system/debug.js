var t1 = +new Date;
var message = [];

module.exports = {

	push: function(msg){
		message.push(msg);
	},
	
	show: function(){
		if(message.length == 0){
			message.push('没有任何操作！');
		}
		$debug = {
			message:  '<li>'+ message.join('</li><li>') +'</li>',
			takentime: +new Date - t1
		};
	},
	
	writeText: function(path, content){
		Fs.writeText(path, content);
		message.push(path.replace(/\.\.\/|.+1kjs.com\//, ''));
	}
};

