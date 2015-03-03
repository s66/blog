
function rename(fileName){
	
}
function eachFiles(reg){
	var fso = new ActiveXObject('Scripting.FileSystemObject');
	var fi = fso.GetFolder('.');//µ±Ç°Ä¿Â¼
	var fenum = new Enumerator(fi.files);
	while(!fenum.atEnd()){
		if(reg.test(fenum.item().Name)){
            fenum.item().Name = fenum.item().Name.replace(/-/, '.');
		}
        fenum.moveNext()
	}
}
eachFiles(/^\d+-\d+$/, function(){
    
    
    
});