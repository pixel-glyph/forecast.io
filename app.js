var weather = require("./weather.js");

console.log("Enter a valid US zip code: ");
process.stdin.setEncoding("utf8");

process.stdin.on("readable", function(){
	var zip = process.stdin.read();
	if (zip !== null) {
		weather.forecast(zip);
	}
});

process.stdin.on("end", function(){
	process.stdout.write("end");
});