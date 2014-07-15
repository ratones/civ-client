// Break out the application running from the configuration definition to
// assist with testing.
// window.requireNode = window.require;
// window.require = undefined; 
requirejs(["config"], function() {
  // Kick off the application.
  requirejs(["app", "router"], function(app, Router) {
    // Define your master router on the application namespace and trigger all
    // navigation from this instance.
    app.router = new Router();
    $.ajaxSetup({
        statusCode: {
            401: function () {
                // Redirect the to the login page.
                Backbone.history.navigate('#/login');

            }
        }
    });
     //app.router.on("route:login",function(){alert("w");});
    // app.router.on("route:factura",function(){alert("f");});

    // Trigger the initial route and enable HTML5 History API support, set the
    // root folder to '/' by default.  Change in app.js.
    Backbone.history.start();//{ pushState: true, root: app.root }
  });
});
