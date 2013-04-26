// based on node v0.10.5 documentation and testing
// http://nodejs.org/api/path.html
// written by Thomas Giles
// https://github.com/wthit56/node.unnecesary.js/blob/master/path.js

// test to see what environment the module is running in
var isBrowser = (typeof (window) !== "undefined"),
	isNode = (!isBrowser && typeof (process) !== "undefined");

// Array prototype
var Array_ = Array.prototype;

// finds an empty string
var empty = /^$/;

// turns all slashes into environment-specific slashes,
// and removes repeated slashes
var fixSlashes = (function () {
	var slashes = /[\\\/]+/g;
	return function (path) {
		return path.replace(slashes, _.sep);
	};
})();

var _ = {
	sep: new String((function () {
		if (isBrowser) { return "/"; }
		else if (isNode) { return process.cwd().match(/[\\\/]/)[0]; }
	})()),
	delimiter: new String((function () {
		if (typeof (window) !== "undefined") { return ";"; }
		if (typeof (process) !== "undefined") {
			return process.env.PATH.match(/[\/;]/)[0];
		}
	})())
};

var _ = {
	// normalizes a given path
	// http://nodejs.org/api/path.html#path_path_normalize_p
	normalize: (function () {
		// regex objects to use while normalising path
		{
			// finds removable ".." (up) parts, including the preceeding folder part
			var up = /^[\\\/]?[^\\\/]+[\\\/]\.\.(?:[\\\/]|$)?|[\\\/][^\\\/]+[\\\/]\.\.(?=[\\\/]|$)/;
			// finds removable "." (current folder) parts
			var dot = /^\.[\\\/]|[\\\/]\.(?=[\\\/]|$)/g;
		}

		// takes parameter "path" to normalize
		// returns normalized path
		return function path_normalize(path) {
			// recursively remove ".." parts and their preceeding folder parts
			while (up.test(path)) {
				path = path.replace(up, "");
			}

			// remove all unnecesary "." parts
			path = path.replace(dot, "");

			// there is no path left after evaluating ".." and "." parts...
			if (path.length === 0) {
				// ...so return "."
				return ".";
			}
			// there is a path left after evaluating ".." and "." parts...
			else {
				// ...so fix slashes and return
				return fixSlashes(path);
			}
		};
	})(),

	// joins given paths and returns normalized result
	// http://nodejs.org/api/path.html#path_path_join_path1_path2
	join: (function () {
		// references to Array prototype methods
		var some = Array_.some, join = Array_.join;

		// returns true when value is not a string
		function isNonString(v) {
			return (typeof (v) !== "string");
		}

		// to be thrown when a passed in argument is not a string
		var error = new TypeError("Arguments to path.join must be strings");

		// takes any number of string paths
		// errors when any arguments are not strings
		// returns normalized path, based on joined paths
		return function path_join(paths) {
			// a passed in argument is not a string...
			if (some.call(arguments, isNonString)) {
				// ...so throw the error
				throw error;
			}
			// all passed in arguments are strings
			else {
				// ...so join using envrinoment-specific slash,
				// and return normalized path
				return _.normalize(join.call(arguments, _.sep));
			}
		};
	})(),

	// resolves given "to" path to an absolute path,
	// using any given "from" paths
	// http://nodejs.org/api/path.html#path_path_resolve_from_to
	resolve: (function () {
		var slice = Array_.slice;

		// stores created arguments array
		var args,
		// stores built path
			path;

		// stores current working folder path,
		// or current url folder path if applicable
		var root,
		// stores absolute root path,
		// "drive:\" in node,
		// "http:\\domain\path" in the browser
			abs;

		// module running in browser...
		if (isBrowser) {
			// ...so use url to find absolute and root folder paths

			// build "protocol//domain" to find absolute path
			abs = window.location.protocol + "//" + window.location.host + "/";
			// remove last filename and add to absolute path to find root folder path
			root = abs + window.location.pathname.replace(/[^\\\/]*$|\?[^\\\/]*$/, "");
		}
		// module is running in node...
		else if (isNode) {
			// ...so use working folder to find absolute and root folder paths

			// find working folder and add environment-specific slash to find root folder path
			root = process.cwd() + _.sep;
			// find path up to and including first slash to find absolute path
			abs = root.match(/^[^\\\/]+[\\\/]/)[0];
		}

		// tests if first character is a slash
		// (string path is absolute)
		var isAbsolute = /^[\\\/]/;

		// finds leading slash(es)
		var leadingSlashes = /^[\\\/]+/;

		// takes any number of "from" string paths,
		// and one "to" string path
		// returns resolved path, based on paths
		return function path_resolve(from_paths, to_path) {
			// convert arguments into array
			args = slice.call(arguments, 0);

			// set path string to last argument ("to" path)
			path = args.pop();

			// while path is not absolute...
			while (!isAbsolute.test(path[0])) {
				// ...add to path

				// there are arguments left...
				if (args.length > 0) {
					// ...so add last argument to beginning of path
					path = args.pop() + _.sep + path;
				}
				// there are no arguments left...
				else {
					// ...so break out of loop
					break;
				}
			}

			// path is absolute...
			if (isAbsolute.test(path)) {
				// ...so finish building path and return

				/* Step-by-step
				//	remove trailing slash
				//		path = path.replace(leadingSlashes, "");
				//	normalize
				//		path = _.normalize(path);
				//	add abolute path to beginning of built path
				//		path = abs + path;
				//	return built path
				//		return path;
				*/

				// build in absolute path, and return
				return abs + _.normalize(path.replace(leadingSlashes, ""));
			}
			else {
				// add root to beginning of built path and return
				return _.normalize(root + path);
			}
		};
	})(),

	// returns path to be used to get from one path to another
	// http://nodejs.org/api/path.html#path_path_relative_from_to
	relative: (function () {
		// finds slashes
		var slashes = /[\\\/]+/g;
		// finds trailing slashes
		var trailingSlashes = /[\\\/]+$/;

		// stores split "from" and "to" parts
		var fromParts, toParts;
		// stores built path
		var path;

		// for use in loop
		var i, l;

		// takes "from" string path,
		// and "to" string path
		// returns relative path from one to the other
		return function path_relative(from, to) {
			// split "from" and "to" paths on slashes
			fromParts = _.normalize(from).split(slashes);
			toParts = _.normalize(to).split(slashes);

			// iteration starts at the beginning
			i = 0;
			// iterate a maximum of l times,
			// where l is the least of the number of "from" parts and the number of "to" parts
			l = Math.min(fromParts.length, toParts.length);
			// we will iterate through "from" and "to" parts until they differ.
			// when we pass the end of one or the other parts arrays, the values are unable to be the same.
			// therefore, we can end the loop

			// while...
			while (
			// there are more items to iterate over,
				(i < l) &&
			// and the current "from" and "to" parts are identical
				(fromParts[i] === toParts[i])
			) {
				// continue to next iteration
				i++;
			}
			// "i" will now be the index of the first item in which the "from" and "to" parts differ

			// "i" passed the last item of either array...
			if ((i > fromParts.length) || (i > toParts.length)) {
				// ...so return "." (empty path)
				return ".";
			}
			// "i" did not pass the last item of either array...
			else {
				// ...so build new path

				/* Step-by-step
				//	find how many "from" parts are left over from where they diverge from the "to" parts
				//		var numberOfExtraFromParts = fromParts.length - i;
				//	create an Array with a number of items equal to
				//	how many times we want the ".." (up) string repeated, plus one.
				//	|	when we .join the Array's items, the string will be added "in between" each item,
				//	|	meaning the string will be added once for each item apart from the last one.
				//	|	this is why we add one to the number of items required
				//		var stringRepeater = new Array(numberOfExtraFromParts + 1);
				//	join each item of the created Array with the string we want repeated ("../")
				//	|	so for an Array with 5 items in it, the .join will produce "../../../../"
				//	|	and for an Array with 2 items in it, the .join will produce "../"
				//		var ups = stringRepeater.join(".." + _.sep);
				//	get all "to" parts from the divergent point onwards
				//		var toPath = toParts.slice(i);
				//	join the "to" parts with a slash ("/")
				//		toPath = toPath.join(_.sep);
				//	add the "ups" string to the "toPath" string to find the relative path
				//		path = ups + toPath;
				//	remove any trailing slashes
				//		path = path.replace(trailingSlashes, "");
				//	return
				//		return path;
				*/

				// build and return the relative path
				return ((new Array(fromParts.length - i + 1).join(".." + _.sep)) + toParts.slice(i).join(_.sep)).replace(trailingSlashes, "");
			}
		};
	})(),

	// find parent folder from given path
	dirname: (function () {
		// finds the last part of a given string path, including its leading slash.
		// [matches] "root[/dir/]", "[/dir/]", "[dir]", "[dir/]", "..[/dir]"
		lastPart = /(?:^|[\\\/])[^\\\/]+[\\\/]?$/;

		// takes string path
		// returns path's parent directory name
		return function path_dirname(path) {
			// remove last part,
			// if the string is then empty, replace with ".",
			// then return
			return path.replace(lastPart, "").replace(empty, ".");
		};
	})(),

	// returns last part of a given path, with any specified extension removed
	basename: (function () {
		// finds last part of a string path
		var lastPart = /[^\\\/]*(?=[\\\/]*$)/;

		// stores matched data
		var match;

		// takes string path,
		// and optional string extension
		// returns basename, with extension removed
		return function path_basename(path, extension) {
			// find last part
			match = path.match(lastPart);

			// no match was found...
			if (!match) {
				// ...so return an empty string
				return "";
			}
			// match was found...
			else {
				// ...so build basename

				// get first item in match data
				match = match[0];

				if (
				// extension was passed in,
					(extension != null) &&
				// and matched string ends in the extension...
					(match.lastIndexOf(extension) == (match.length - extension.length))
				) {
					// ...so return the string up to where the extension starts
					return match.substring(0, match.length - extension.length);
				}
				// extension not found in matched string...
				else {
					// ...so return string as-is
					return match;
				}
			}
		};
	})(),

	// finds extension from path
	extname: (function () {
		// finds a path's extension
		// |	in last part (before any "?" query begins, for browser compatibility)
		// |	last part must not begin with "."
		// |	last part must have "."
		var ext = /[^\\\/\.]+(\.[^\\\/]*)(?=(?:\?[\W\w]*)?$)/;

		// stores matched data
		var match;

		// takes string path
		// returns extension, including "."
		return function (path) {
			// find extension
			match = path.match(ext);

			// extension found...
			if (match) {
				// ...so return extension
				return match[1];
			}
			// extension not found...
			else {
				// ...so return empty string
				return "";
			}
		};
	})(),

	// environment-specific separator (usually a slash)
	sep: _.sep,

	// environment-specific path delimiter (semi-colon in Windows)
	delimiter: _.delimiter
};

// environment is a browser...
if (isBrowser) {
	// ...so if the module has not been loaded already...
	if (!window.path) {
		// ...add path object to the global window object
		window.path = _;
	}
}
// environment is node...
if (isNode) {
	// ...so add path object to exports
	module.exports = _;
}
