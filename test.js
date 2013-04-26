var console = require("./console.js");
var u, p;

var end = null;
function changeObj(name) {
	if (u) { console.groupEnd(); }

	console.group(name);
	u = require("./" + name + ".js");
	n = require(name);
	if (end == null) {
		setTimeout(function () {
			console.groupEnd();
			end = null;
		}, 0);
	}
}

var test = (function () {
	var uResult, nResult,
		i, c, l;

	return function (method_name, test_params) {
		console.group("." + method_name);
		for (i = 1, l = arguments.length; i < l; i++) {
			c = arguments[i];
			uResult = u[method_name].apply(u, c);
			nResult = n[method_name].apply(n, c);

			console.log(JSON.stringify(c), " == \"" + uResult + "\"");
			if (uResult !== nResult) {
				console.error("\tnode path == \"" + nResult + "\"");
			}
		}
		console.groupEnd();
	};
})();

changeObj("path");
{
	test("normalize",
		["\\pre-slash"],
		["fix/back-slash"],
		["fix//two//back-slashes"],
		["fix\\\\two\\\\slashes"],
		["no-change"],
		[".\\remove-pre-dot"],
		["mid\\.\\dot"],
		["root\\child\\.."],
		["empty-to-dot\\.."],
		["remove\\.\\mid-dot"],
		["up\\..\\then-down"],
		["..\\pre-up"],
		["multiple-ups\\fail\\fail\\..\\.."]
	);

	test("join",
		[".", "single\\dot", "."],
		["..", "fail", "..", "up/dots", "fail", "fail", "..", ".."]
	);

	test("resolve",
		["fail", "\\dir\\sub", "..", "child"],
		["fail", "\\dir\\sub", ".", "child"],
		["dir\\sub", "sub", "child"]
	);

	test("relative",
		["root\\child", "root"],
		["c:\\dir", "c:\\dir\\sub"],
		["/dir\\sub/child", "\\dir\\sub2\\a"],
		["root", "child"],
		["root", "root"]
	);

	test("dirname",
		["\\"],
		["dir"],
		["dir\\"],
		["..\\dir\\"],
		["dir\\sub"],
		["dir\\sub/.."]
	);

	test("basename",
		["root\\child", null],
		["child.ext", null],
		["child.ext", ".ext"],
		["child.ext", ".ext"],
		["root\\.ext", ".ext"],
		["child.ext", ".ext"],
		["child.ext", "ext"]
	);

	test("extname",
		["root\\child.ext"],
		["root.dir\\child-dir"],
		["root.dir\\child-dir.ext"],
		["file"],
		["file."],
		["file.ext"],
		[".ext"]
	);

	console.log(".sep = \"" + u.sep + "\"");

	console.log(".delimiter = \"" + u.delimiter + "\"");
}
