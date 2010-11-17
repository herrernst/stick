var {Server} = require("ringo/httpserver");
var {Application} = require("stick");
var {error, notfound, mount, static, basicauth} = require("stick/middleware");

// helper for creating simple dummy pages
function dummyPage(text) {
    return function(req) {
        return { status: 200, headers: {}, body: [text] };
    }
}

// create a new blank Stick application
var app = exports.app = new Application();
// configure error, notfound, mount, and static middleware
app.configure(error, notfound, mount, static);
// middleware chain now is error > notfound > mount > anonymous > unhandled
// mount hello world application at /hello
app.mount("/hello", dummyPage("hello world!"));
// throw notfound object to test notfound middleware
app.mount("/notfound", function(req) {
    throw { notfound: true };
});
// serve files in lib as static resources 
app.static(module.resolve("lib"));

// create a password protected admin application
var admin = new Application(dummyPage("admin zone"));
admin.configure(basicauth);
// add basic authentication, password is "secret"
admin.basicauth("/", "admin", "e5e9fa1ba31ecd1ae84f75caaa474f3a663f05f4");
// mount on /admin
app.mount("/admin", admin);

// start server if we didn't already do so
var server = server || new Server({app: app});
server.start();
