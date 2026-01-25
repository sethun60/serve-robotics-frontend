// Custom file transformer for Jest that returns empty module for CSS
module.exports = {
	process() {
		return {
			code: "module.exports = {};",
		};
	},
};
