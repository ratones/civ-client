define(['jquery', 'underscore', 'backbone', 'text!modules/dashboard/templates/dashboard.html'], function($, _, Backbone, template) {
	var client=undefined;
	var DashboardView = Backbone.View.extend({
		//el : '.page',
		initialize : function() {
           
		},
		render : function() {
			var self = this;
			 this.$el.html(template);
			//window.require = window.requireNode;
			 //var gui = requireNode('nw.gui');

            // Print arguments
            //gui.Shell.openExternal('http://www.google.be');
            if(window.requireNode){
	            console.log(requireNode('os').hostname());
	            var fs = requireNode('fs');
	            //window.requireNode = window.require;
	            //window.require = undefined;
	            client = requireNode('https');
	            var options = {
				  host: 'prog.rarom.ro',
				  port: 444,
				  path: 'utils/GetNews/',
				  method: 'GET',
				  agent:false,
				  ca:fs.readFileSync('c:/users/cristian_mar/desktop/ClientCaros.cer'),
				  pfx:fs.readFileSync('c:/users/cristian_mar/desktop/client-carosieri.pfx'),
				  passphrase:'rarom2012',
				  rejectUnauthorized:false
				};
				var req = client.request(options, function(res) {
				  console.log("statusCode: ", res.statusCode);
				  console.log("headers: ", res.headers);
				
				  res.on('data', function(d) {
				    process.stdout.write(d);
				    //console.log(d);
				  });
				});
				req.end();
				
				req.on('error', function(e) {
				  console.error(e);
				});
				// var request = require('request');
				// request({'url':'https://prog.rarom.ro:444/variante/gettipuri',
				        // 'proxy':'http://80.86.99.115:3128'}, function (error, response, body) {
				    // if (!error && response.statusCode == 200) {
				        // console.log(body);
				    // }
				// });
            }
		}
	});
	return DashboardView;
});
