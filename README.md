# GOV.UK Pay service integration demo

The goal of this code is to showcase how quick and easy it can be to integrate with the GOV.UK Pay service. <br />
The main focus of this exercise has been conciseness and clarity of intent - thus, thorough errors and edge conditions handling
has not been addressed.

With one single Node.js file (around 100 lines) we are able to:
* start the card payment flow with a customisable amount to pay for the service
* have the user pay for that service (on the GOV.UK website)
* check the status of the transaction

The steps are:

1. contact the Pay API passing these details (done through command line):
  * our private token
  * the amount we would like the user to pay
  * the URL (on the local machine) to redirect the user to after the they have successfully entered the payment information
2. trigger the opening of a Chrome tab that will load the GOV.UK pages where the user enters their payment details
3. at the end of the process GOV.UK will redirect the user to the webpage we set in step 1 (which is hosted on the Node.js server running on 8181)
where we check the status of the transaction.

## Project setup
* install Node.js
* install Express through npm <br />
`npm install express`
* create a test SSL certificate as <br />
`sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout server.key -out server.crt`
* export PAY_API_TOKEN=[token_here]

## Run the app
`node pay_test.js 12000` <br />
The argument is the amount (in cents) you would like to charge the user with.


## TODO
* pass the amount to charge on the command line (rather than hardcoding it)
* general code refactoring
* the server port (8181) is duplicated
* disclaimer this is just my test, no correctness, no reviewed