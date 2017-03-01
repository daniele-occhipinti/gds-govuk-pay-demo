# GOV.UK Pay service integration demo

The goal of this code is to showcase how quick and easy it is to integrate with the GOV.UK Pay service.

With one single Node.js file (around 100 lines) we are able to:
* start the card payment flow with a custom amount to pay
* have the user pay for a service (on the GOV.UK website)
* check the status of the transaction

The steps are:
* contact the Pay API passing (through command line):
** our private token
** the amount we would like the user to pay (through command line)
** the URL to redirect the user to after the user has successfully entered the payment information (it will be on localhost)
* trigger the opening of a Chrome tab that will load the GOV.UK pages where the user enters their payment details
* at the end of the process the GOV.UK will redict the user to the webpage we set initially (which is hosted on our server running on 8181)
where we check the status of the transaction.

## Project setup
* install Node.js
* install Express through npm `npm install express`
* create a test SSL certificate as
`sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout server.key -out server.crt`
* export PAY_API_TOKEN=[token_here]



## TODO
* improve formatting of the documentation
* pass the amount to charge on the command line (rather than hardcoding it)
* general code refactoring
* the server port (8181) is duplicated
* disclaimer this is just my test, no correctness, no reviewed