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
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded());
//
var busboy = require('connect-busboy');
app.use(busboy());

var fs = require('fs');
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
  var xlsx = require('node-xlsx');
  if(typeof require !== 'undefined') XLSX = require('xlsx');
  var workbook = XLSX.readFile('public/nlfcarpools.xlsx');
  /* DO SOMETHING WITH workbook HERE */
  var worksheet = workbook.Sheets["Rides Form Responses"];
  response.send(XLSX.utils.sheet_to_json(worksheet, {header:1}).slice(0,31)); // <-- this is an array of arrays that you can use

});

app.post("/excel/upload", busboy(), function(request, response){
  console.log("/excel/upload received");
  var fstream;
  request.pipe(request.busboy);
  request.busboy.on('file', function (fieldname, file, filename) {
    console.log("file received");
    console.log("Uploading: " + filename);
    fstream = fs.createWriteStream(__dirname + filename);
    file.pipe(fstream);
    fstream.on('close', function () {
        response.sendFile("/public/download.html",{root:__dirname});
      });
    });
});

app.post("/excel/read", function(request, response){
  var filename = request.body.filename;
  console.log(request.body);
  var xlsx = require('node-xlsx');
  if(typeof require !== 'undefined') XLSX = require('xlsx');
  var workbook = XLSX.readFile(__dirname + "/public"+filename);
  /* DO SOMETHING WITH workbook HERE */
  var worksheet = workbook.Sheets["Rides Form Responses"];
  response.send(XLSX.utils.sheet_to_json(worksheet, {header:1})); // <-- this is an array of arrays that you can use
});


app.post("/excelize", function(request, response){
  console.log("received /excelize request");
  var xlsx = require('node-xlsx');
  var worksheets = [];
  var arrs = request.body.arrs;

  worksheets.push(arrs)

  var buff = xlsx.build([{name:"sheet" ,data:arrs}]);
  var fs = require('fs');
  // var buff = xlsx.build([{name:"Auto-gernerate Ride Sheet", data:arrs}]);

  console.log(buff);
  var f = fs.writeFile("./public/results.xlsx",buff,function(err){
      response.end();
  });

});

app.get("/download", function(request,response){
  console.log("received /download request");
  response.download(__dirname + "/public/results.xlsx", function(err){
    console.log(err);

  });

});

app.get("/excel", function(request,response){
  response.sendFile("/public/excel.html", {root:__dirname});
});

// start server on the specified port and binding host
app.listen(appEnv.port, function() {

	// print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
