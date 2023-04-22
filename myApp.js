const express = require('express');
const app = express();
const helmet = require('helmet')
const router = express.Router()
const ninetyDaysInSeconds = 60*60*24*90

// Hackers can exploit known vulnerabilities in Express/Node 
// if they see that your site is powered by Express. X-Powered-By: 
// Express is sent in every request coming from Express by default. 
// Use the helmet.hidePoweredBy() middleware to remove the X-Powered-By header.

// app.use(helmet.hidePoweredBy())

// mislead attackers into thinking this app uses PHP
app.use(helmet.hidePoweredBy({setTo: "PHP 4.2.0"}))
// disable iframes
app.use(helmet.frameguard({action: 'deny'}))
// disables browsers' buggy cross-site scripting filter by setting the X-XSS-Protection header to 0
app.use(helmet.xssFilter())
// sets the X-Content-Type-Options header to nosniff. This mitigates MIME type sniffing which can cause security vulnerabilities. See documentation for this header on MDN for more.
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
app.use(helmet.noSniff())
// sets the X-Download-Options header to noopen. This will prevent IE users from executing downloads in the trusted site’s context.
app.use(helmet.ieNoOpen())
// force the use of https
app.use(helmet.hsts({
  maxAge: ninetyDaysInSeconds,
  force: true,
}))
// disable DNS pre-fetching (caching IPs of links on page)
app.use(helmet.dnsPrefetchControl())
// disable caching on client browser
app.use(helmet.noCache())
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "trusted-cdn.com"]
  }
}))

// the above can be done as below:

// app.use(helmet({
//   frameguard: {         // configure
//     action: 'deny'
//   },
//   contentSecurityPolicy: {    // enable and configure
//     directives: {
//       defaultSrc: ["'self'"],
//       scriptSrc: ["'self'", "trusted-cdn.com"]
//     }
//   },
//   dnsPrefetchControl: false     // disable
// }))








































module.exports = app;
const api = require('./server.js');
app.use(express.static('public'));
app.disable('strict-transport-security');
app.use('/_api', api);
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});
let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Your app is listening on port ${port}`);
});
