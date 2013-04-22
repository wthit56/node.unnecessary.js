var console=require("./console.js");
var u = require("./path.js"), p = require("path");

function arrayToString(array){
	return "['"+array.join("', '")+"']";
}

var test;
console.group("path.normalize");
{
	test=function(path, success) {
		var n = u.normalize(path);
		if (n === success) {
			console.log("\"" + path + "\" passed");
		}
		else {
			console.error("\"" + path + "\" should be \"" + success + "\", but was normalized to \"" + n + "\" "+p.normalize(path));
		}
	};
	
	test("\\pre-slash", "\\pre-slash");
	test("fix/back-slash", "fix\\back-slash");
	test("fix//two//back-slashes", "fix\\two\\back-slashes");
	test("fix\\\\two\\\\slashes", "fix\\two\\slashes");
	test("no-change", "no-change");
	test(".\\remove-pre-dot", "remove-pre-dot");
	test("mid\\.\\dot", "mid\\dot");
	test("root\\child\\..", "root");
	test("empty-to-dot\\..", ".");
	test("remove\\.\\mid-dot", "remove\\mid-dot");
	test("up\\..\\then-down", "then-down");
	test("..\\pre-up", "..\\pre-up");
	test("multiple-ups\\fail\\fail\\..\\..", "multiple-ups");
}
console.groupEnd();

console.group("path.join");
{
		test=function(paths, success){
			var j=u.join.apply(u, paths);
			if(j===success){
				console.log(arrayToString(paths)+" passed");
			}
			else{
				console.log(arrayToString(paths)+" should be \""+success+"\", but was joined as \""+j+"\"");
			}
		};
		
		test([".", "single\\dot", "."], "single\\dot");
		test(["..", "fail", "..", "up/dots", "fail", "fail", "..", ".."], "..\\up\\dots");
}
console.groupEnd();

console.group("path.resolve");
{
	test = (function(){
		var prefix;
		if(typeof(window)!=="undefined"){prefix=window.location.protocol+window.location.host;}
		else if (typeof(process)!=="undefined") { prefix=process.cwd(); }
		
		return function(paths, success){
			var r=u.resolve.apply(u,paths);
			if(r.indexOf(prefix)===0){
				r=r.substring(prefix.length);
			}
			
			if(r===success){
				console.log(paths, "passed");
			}
			else{
				console.log(paths, "should be \""+success+"\", but resolved to \""+r+"\"");
			}
		};
	})();
		
	test(["fail", "\\dir\\sub", "..", "child"], "\\dir\\child");
	test(["fail", "\\dir\\sub", ".", "child"], "\\dir\\sub\\child");
	test(["dir\\sub", "sub", "child"], "\\dir\\sub\\sub\\child");
}
console.groupEnd();

console.group("path.relative");
{
	test = (function(){
		return function(from, to, success){
			var r=u.relative(from, to);

			if(r===success){
				console.log([from,to], "passed");
			}
			else{
				console.log([from,to], "should be \""+success+"\", but resolved to \""+r+"\"");
			}
		};
	})();
		
	test("root\\child", "root", "..");
	test("c:\\dir", "c:\\dir\\sub", "sub");
	test("/dir\\sub/child", "\\dir\\sub2\\a", "..\\..\\sub2\\a");
}
console.groupEnd();

console.group("path.dirname");
{
	test = function(path, success){
		var d=u.dirname(path);
		if(d===success){
			console.log("\""+path+"\" passed");
		}
		else{
			console.error("\""+path+"\" should be \""+success+"\", but dirname'd to \""+d+"\"");
		}
		
		console.log("\t"+p.dirname(path));
	};
	
	test("\\", "\\");
	test("dir", ".");
	test("dir\\", ".");
	test("..\\dir\\", "..");
	test("dir\\sub", "dir");
	test("dir\\sub/..", "dir\\sub");
}
console.groupEnd();





