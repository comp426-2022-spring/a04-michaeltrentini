// require dependencies
const express = require('express')
const app = express()
const fs = require('fs')
const args = require('minimist')(process.argv.slice(2))
const morgan = require('morgan')

//require database
const db = require('./database.js')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

args['port']
//listen
const port = args.port || process.env.PORT || 5555

// Start an app server
const server = app.listen(port, () => {
    console.log('App listening on port %PORT%'.replace('%PORT%',port))
});

//help messages
console.log(args)
const help = (`
server.js [options]

--port	Set the port number for the server to listen on. Must be an integer
            between 1 and 65535.

--debug	If set to true, creates endlpoints /app/log/access/ which returns
            a JSON access log from the database and /app/error which throws 
            an error with the message "Error test successful." Defaults to 
            false.

--log		If set to false, no log files are written. Defaults to true.
            Logs are always written to database.

--help	Return this message and exit.
`)

if (args.help || args.h) {
    console.log(help)
    process.exit(0)
}


//a2 flip functions
function coinFlip() {
    var output;
    var random = Math.random();
    if (random < 0.5) {
      output = "heads";
    }
      else {
        output = "tails";
      }
      return output;
    }


function coinFlips(flips) {
    let list = [];
    let i = 0;
    while (i < flips) {
      list.push(coinFlip());
      i++;
    }
    return list;
    }
    
    
function countFlips(array) {
    var heads = 0;
    var tails = 0;
    var i = 0;
    while (i<array.length) {
      if (array[i] == "heads") {
        heads++;
      }
      else {
        tails++;
      }
      i++;
    }
    if (tails == 0) {
      return "{ tails: " + tails + "} ";
    }
    if (heads == 0) {
      return "{ heads: " + heads + "} ";
    }
    return "{ heads: " + heads + ", tails: " + tails + " }";
    }
    
    
function flipACoin(call) {
      var flip = coinFlip(call);
      var result;
      if (call == flip) {
        result = "win";
      }
      else {
        result = "lose";
      }
      return {call: call, flip: flip, result: result}
    }



    //a03 stuff
    app.get('/app/', (req, res) => {
        res.statusCode = 200
        res.statusMessage = 'OK'
        res.writeHead(res.statusCode, { 'Content-Type' : 'text/plain' })
        res.end(res.statusCode + ' ' + res.statusMessage)
    })


    app.get('/app/flip', (req, res) => {
        res.status(200).json({ 'flip': coinFlip() })
    })
    

    app.get('/app/flips/:number', (req, res) => {
        const flips = coinFlips(req.params.number)
        const count = countFlips(flips)
        res.status(200).json({ 'raw': flips, 'summary': count })
    })
    

    app.get('/app/flip/call/heads', (req, res) => {
        const guess = flipACoin('heads')
        res.status(200).json({ 'call': guess.call, 'flip': guess.flip, 'result': guess.result })
    })
    

    app.get('/app/flip/call/tails', (req, res) => {
        const guess = flipACoin('tails')
        res.status(200).json({ 'call': guess.call, 'flip': guess.flip, 'result': guess.result })
    })
    

    app.use(function(req, res){
        res.status(404).send('404 NOT FOUND')
    })