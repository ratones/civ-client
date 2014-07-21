define(function(require,exports,module){
	//external dependencies
	var app = require('app');
	var controller = require('./controller');
	
	mymodule.Controller = new controller();
	console.log(mymodule);
	var mymodule = module.exports;
});
