/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// response and request routing
app.get("/", function(request, response){
  response.sendFile("public/index.html", {root:__dirname});
  return;
});

app.get("/test", function(request, response){
  response.sendFile("public/test.html", {root:__dirname});
  return;
});

app.get("/testdata", function(request, response) {
  console.log("received /testdata request");
  var xlsx = require('xlsx');
  if(typeof require !== 'undefined') XLSX = require('xlsx');
  var workbook = XLSX.readFile('public/nlfcarpools.xlsx');
  /* DO SOMETHING WITH workbook HERE */
  var worksheet = workbook.Sheets["Rides Form Responses"];
  console.log(workbook);
  console.log(worksheet);
  response.send(XLSX.utils.sheet_to_json(worksheet, {header:1}).slice(0,31)); // <-- this is an array of arrays that you can use


});

// start server on the specified port and binding host
app.listen(appEnv.port, function() {

	// print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
