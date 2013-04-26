var group = {
	depth: 0,
	hiddenDepth: -1
};

var newConsole = module.exports = {
	log: function (messages) {
		if ((group.hiddenDepth !== -1) && (group.depth >= group.hiddenDepth)) { return; }
		Array.prototype.unshift.call(arguments, new Array(group.depth + 1).join(" | "));
		console.log.apply(console, arguments);
	},

	group: function (name) {
		this.log("- " + Array.prototype.join.call(arguments, " "));
		group.depth++;
	},
	groupCollapsed: function (messages) {
		Array.prototype.unshift.call(arguments, "+");
		this.log.apply(this, arguments);
		group.depth++;
		if (group.hiddenDepth === -1) {
			group.hiddenDepth = group.depth;
		}
	},
	groupEnd: function () {
		group.depth--;
		if (group.depth < group.hiddenDepth) {
			group.hiddenDepth = -1;
		}
	},

	/* ANSI reference links
	//	http://roguejs.com/2011-11-30/console-colors-in-node-js/
	//	http://en.wikipedia.org/wiki/ANSI_escape_code
	*/
	error: function (messages) {
		var args = Array.prototype.slice.call(arguments, 0);
		args.unshift("\033[90;31m*\033[0m");
		this.log.apply(this, args);
	},
	warn: function (messages) {
		var args = Array.prototype.slice.call(arguments, 0);
		args.unshift("\033[90;33m!\033[0m");
		this.log.apply(this, args);
	}
};
