# GOV.UK Pay service integration demo

The goal of this code is to showcase how quick and easy it can be to integrate with the GOV.UK Pay service. <br />
The main focus of this exercise has been conciseness and clarity of intent - thus, thorough errors and edge conditions handling
has not been addressed. The code has not pair-reviewed either - this was just my personal spike/experiment (and I am no Node.js expert).

With one single Node.js file (less than 100 lines) I am able to:
* start the card payment flow with a customisable amount to pay for the service (launched from the command line to keep things as streamlined as possible)
* have the user pay for that service (on the GOV.UK website)
* check the status of the transaction

The steps the code implements are as follows:

1. contact the Pay API passing these details (done through command line):
  * our private token
  * the amount I would like the user to pay
  * the URL (on the local machine) to redirect the user to after the they have successfully entered the payment information
2. trigger the opening of a Chrome tab that will load the GOV.UK pages where the user enters their payment details
3. at the end of the process GOV.UK will redirect the user to the webpage I set in step 1 (which is hosted on the Node.js server running on 8181)
where I check the status of the transaction.

## Project setup

You will need to be on MacOS with Google Chrome installed, as I am using a non-portable command to fire up Chrome.

* install Node.js
* install Express through npm <br />
`npm install express`
* create a test SSL certificate as <br />
`sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout server.key -out server.crt`
* `export PAY_API_TOKEN=[token_here]`

## Run the app
`node pay_test.js amount_cents=12000` <br />
The argument is the amount (in cents) you would like to charge the user with.

## Demo
[![IMAGE ALT TEXT](http://img.youtube.com/vi/PHlJ11Fpq7o/0.jpg)](http://www.youtube.com/watch?v=PHlJ11Fpq7o "Pay integration demo")

## License
This code is released under the MIT license.

## TODO
* general code refactoring