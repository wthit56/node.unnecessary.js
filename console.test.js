var console = require("./console.js");

console.log("log");
{
	console.group("group");
	{
		console.log("grouped");
		console.group("level 2");
		{
			console.log("grouped");
		}
		console.groupEnd();
		console.log("grouped");
		console.groupCollapsed("level 2");
		{
			console.log("hidden");
			console.groupCollapsed("level 3");
			{
				console.log("hidden");
			}
			console.groupEnd();
		}
		console.groupEnd();
		console.log("grouped");
	}
	console.groupEnd();
}
console.log("log");
{
	console.groupCollapsed("level 1");
	console.log("hidden");
	console.groupEnd();
}
console.log("log");
