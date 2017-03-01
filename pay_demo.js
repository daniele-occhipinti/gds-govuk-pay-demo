const https = require('https'),
      express = require('express')
      childProc = require('child_process'),
      fs = require('fs');

const serverPort = 8181;

const host = "publicapi.payments.service.gov.uk";
const paymentsEndpointPath = "/v1/payments";

const token = process.env.PAY_API_TOKEN;

const returnUrl = `https://0.0.0.0:${serverPort}/?ref=` + paymentReference;

const amountInCents = parseInt(process.argv[2], 10); // amount is passed from the command line

var paymentReference = "DAN-OCC-" + Math.floor(Math.random() * 10000);

var selfUrlHref;

var dataString = JSON.stringify({
    "amount": amountInCents,
    "reference" : paymentReference,
    "description": "Pay Integration Demo",
    "return_url": returnUrl,
});

var options = {
  host: host,
  port: 443,
  path: paymentsEndpointPath,
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json',
    'Content-Length': dataString.length
  }
};

var req = https.request(options, function(res) {
  res.setEncoding('utf8');
  res.on('data', function (responseBody) {

    var jsonResponseBody = JSON.parse(responseBody);
    var nextUrlHref = jsonResponseBody._links.next_url.href;
    selfUrlHref = jsonResponseBody._links.self.href;

    childProc.exec('open -a "Google Chrome" ' + nextUrlHref, function () {});

  });
})

req.write(dataString)
req.end();





var options = {
    key: fs.readFileSync('./server.key'),
    cert: fs.readFileSync('./server.crt'),
};

var app = express();

var server = https.createServer(options, app).listen(serverPort, function(){
  console.log("Express server listening on port " + serverPort);
});

app.get('/', function (req, res) {

    var options2 = {
      host: host,
      port: 443,
      path: selfUrlHref,
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    };

    var req2 = https.request(options2, function(res2) {

      res2.setEncoding('utf8');

      res2.on('data', function (responseBody) {

        var jsonResponseBody = JSON.parse(responseBody);

        var status = jsonResponseBody.state.status;

        var message;

        if (status == "success") {
            message = "Successful payment";
        } else {
            message = "Some error occurred";
        }

        res.writeHead(200);
        res.end(message);

      });

    });

    req2.end();

});
