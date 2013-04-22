
var slashes=/[\\/]+/g
function fixSlashes(path){
	return path.replace(slashes, "\\");
}

module.exports = {
	normalize: (function(){
		var dot = /^\.\\|\\\.(?=\\|$)/g,
			//up = /(?:^|\\)[^\\]+\\\.\.(?=\\|$)/g,
			up = /^\\?[^\\]+\\\.\.(?:\\|$)?|\\[^\\]+\\\.\.(?=\\|$)/,
			removePre=false;
		
		return function (path) {
			path=fixSlashes(path);

			removePre=false;
			while (up.test(path)) {
				path = path.replace(up, "");
			}
			if(removePre){
				if(path[0]==="\\"){path=path.substring(1);}
			}
			
			path=path.replace(dot, "");
			
			if (path.length === 0) { path = "."; }

			return path;
		};
	})(),
	join:function(paths){
		return this.normalize(Array.prototype.join.call(arguments, "\\"));
	},
	resolve:(function(){
		var args, path;
		return function(paths){
			args=Array.prototype.slice.call(arguments, 0);
			
			path=this.normalize(args.pop());
			while(path[0]!=="\\"){
				if(args.length>0){
					path=this.normalize(args.pop()+"\\"+path);
				}
				else{
					path=this.normalize("\\"+path);
					break;
				}
			}
			
			if(typeof(window)!=="undefined"){path=window.location.protocol+window.location.host+path;}
			else if (typeof(process)!=="undefined") { path=process.cwd()+path; }
			
			return path;
		};
	})(),
	relative:(function(){
		return function(from, to){
			var fromParts = this.normalize(from).split(/\\/g),
				toParts=this.normalize(to).split(/\\/g);
			
			var i=0, l=Math.min(fromParts.length, toParts.length);
			while((i<l) && (fromParts[i]===toParts[i])){
				i++;
			}
			//console.log(i);
			if(i>l){
				return ".";
			}
			else{
				var path = (new Array(fromParts.length-i+1).join("..\\")) + toParts.slice(i).join("\\");
				if(path[path.length-1]==="\\"){path=path.substring(0, path.length-1);}
				return path;
			}
		};
	})(),
	dirname:(function(){
		var lastPart=/^\\[^\\]+$|^[^\\]+\\?$|\\[^\\]+\\?$/;
		
		return function(path){
			path=fixSlashes(path).replace(lastPart, "");
			if(path.length===0){path=".";}
			
			return path;
		};
	})()
};


















