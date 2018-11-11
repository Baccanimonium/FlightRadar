//init express
const express = require('express');
const request = require('request');
const app = express();
const port = 3001;



//set middleware. check all requests for file type. if there is no extension and no "/api/" route. return index.html
app.use(function (req, res, next) {
	if(/\.[a-z]|api/i.test(req.originalUrl) === false){
		return res.sendFile(__dirname +'/dist/index.html')
	}
	next();
});

//directory for static files
app.use(express.static('dist'));

app.get('/api/get-flights', (req, response) => {
	//sending request to steamAPI
	request.get('https://data-live.flightradar24.com/zones/fcgi/feed.js?bounds=56.84,55.27,33.48,41.48',

		function(error, steamHttpResponse, body) {
			console.log(body)
			// Once we get the body of the steamHttpResponse, send it to our client
			// as our own httpResponse
			response.setHeader('Content-Type', 'application/json');
			response.send(body);
		});
})

app.listen(port, (err) => {
	if (err) {
		return console.log('something bad happened', err)
	}
	console.log(`server is listening on ${port}`)
})
