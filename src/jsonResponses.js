const games = {
   Example : {
     name : 'Example Title',
     date : '2020-10-21',
     time : '13:30',
     host : 'tester-h',
   },
};

const respondJSON = (request, response, status, object) => {
  const headers = {
    'Content-Type': 'application/json',

  };

  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  const headers = {
    'Content-Type': 'application/json',

  };

  response.writeHead(status, headers);
  response.end();
};

const getGames = (request, response) => {
  const responseJSON = {
    games,
  };

  respondJSON(request, response, 200, responseJSON);
};

const getGamesMeta = (request, response) => respondJSONMeta(request, response, 200);

const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found!',
    id: 'not found',
  };

  return respondJSON(request, response, 404, responseJSON);
};

const notFoundMeta = (request, response) => respondJSONMeta(request, response, 404);

const addGame = (request, response, body) => {
  const responseJSON = {
    message: 'Game, dates, and time are required.',
  };

  if (!body.name || !body.date ||!body.time || !body.host) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 201;

  if (games[body.name]) {
    responseCode = 204;
  } else {
    games[body.name] = {};
    games[body.name].name = body.name;
  }

  games[body.name].date = body.date;
  games[body.name].time = body.time;
  games[body.name].host = body.host;

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully!';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSONMeta(request, response, responseCode);
};



module.exports = {
  getGames,
  addGame,
  getGamesMeta,
  notFound,
  notFoundMeta,
};
