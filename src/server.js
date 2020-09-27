const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/addGame') {
    const body = [];

    request.on('error', (err) => {
      console.dir(err);
      response.statusCode = 400;
      response.end();
    });

    request.on('data', (chunk) => {
      body.push(chunk);
    });

    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);

      jsonHandler.addGame(request, response, bodyParams);
    });
  }
};

const urlStruct = {
  GET: {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
    '/getGames': jsonHandler.getGames,
    notFound: jsonHandler.notFound,
  },
  HEAD: {
    '/getGames': jsonHandler.getGamesMeta,
    notFound: jsonHandler.notFoundMeta,
  },
  POST: {
    '/addGame': jsonHandler.addGame,
    notFound: jsonHandler.notFoundMeta,
  },
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  console.dir(parsedUrl.pathname);
  console.dir(request.method);
  
  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  } else if (urlStruct[request.method][parsedUrl.pathname]) {
    urlStruct[request.method][parsedUrl.pathname](request, response, parsedUrl);
  } else {
    urlStruct[request.method].notFound(request, response);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
