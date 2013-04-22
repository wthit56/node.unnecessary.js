var group={
	depth:0,
	hiddenDepth:-1
};

var newConsole = module.exports = {
	log: function (messages) {
		if((group.hiddenDepth!==-1)&&(group.depth>=group.hiddenDepth)){ return; }
		Array.prototype.unshift.call(arguments, new Array(group.depth+1).join(" | "));
		console.log.apply(console, arguments);
	},

	group: function (messages) {
		this.log("- "+Array.prototype.join.call(arguments, " "));
		group.depth++;
	},
	groupCollapsed: function (messages) {
		Array.prototype.unshift.call(arguments, "+");
		this.log.apply(this, arguments);
		group.depth++;
		if(group.hiddenDepth===-1){
			group.hiddenDepth=group.depth;
		}
	},
	groupEnd: function () {
		group.depth--;
		if(group.depth<group.hiddenDepth){
			group.hiddenDepth=-1;
		}
	},
	
	error:function(){this.log.apply(this,arguments);},
	warn:function(){this.log.apply(this,arguments);}
};
