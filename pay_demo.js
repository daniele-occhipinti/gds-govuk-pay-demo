const https = require('https'),
      express = require('express')
      childProc = require('child_process'),
      fs = require('fs');
      
const apiHost = "publicapi.payments.service.gov.uk",
      apiPaymentsEndpointPath = "/v1/payments",
      serverPort = 8181,
      apiToken = process.env.PAY_API_TOKEN, // set up on command line with: export PAY_API_TOKEN=[token_here]
      paymentReference = "DAN-OCC-" + Math.floor(Math.random() * 10000),
      returnUrl = `https://0.0.0.0:${serverPort}/?ref=` + paymentReference,
      paymentDescription = "Pay Integration Demo",
      amountInCents = parseInt(process.argv[2], 10); // amount is passed from the command line;

var selfUrlHref;

// Initialising payment and launching the web payment form

var dataString = JSON.stringify({
    "amount": amountInCents,
    "reference" : paymentReference,
    "description": paymentDescription,
    "return_url": returnUrl,
});

var options = {
  host: apiHost,
  port: 443,
  path: apiPaymentsEndpointPath,
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + apiToken,
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

// Setting up the local server for the returning URL and checking the status of the transaction

var options = {
    key: fs.readFileSync('./server.key'),
    cert: fs.readFileSync('./server.crt'),
};

var app = express();

var server = https.createServer(options, app).listen(serverPort, function(){
  console.log("Express server listening on port " + serverPort);
});

app.get('/', function (req, res) {

    var options = {
      host: apiHost,
      port: 443,
      path: selfUrlHref,
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + apiToken,
        'Content-Type': 'application/json'
      }
    };

    var req2 = https.request(options, function(res2) {

      res2.setEncoding('utf8');

      res2.on('data', function (responseBody) {

        var jsonResponseBody = JSON.parse(responseBody);

        var status = jsonResponseBody.state.status;

        res.writeHead(200);
        res.end(status == "success" ? "Successful payment" : "Some error occurred");
      });
    });

    req2.end();
});
