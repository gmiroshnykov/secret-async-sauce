var token = '78bea3c9ab59165a670ee62c1756866d0f097f5a';

var request = require('request').defaults({
  headers: {
    'User-Agent': process.title + ' ' + process.version,
    'Authorization': 'bearer ' + token
  }
});

module.exports = function(callback) {
  var url = 'https://api.github.com/legacy/repos/search/unicorns';
  request(url, function(err, response, body) {
    if (err) return callback(err);

    var repositories = JSON.parse(body).repositories;
    var output = {};

    var didWeFail = false;
    var counter = 0;
    var total = repositories.length;
    for (var i = 0; i < total; i++) {
      var repository = repositories[i];
      var fullname = repository.owner + '/' + repository.name;

      var url = 'https://api.github.com/repos/' + repository.owner +
        '/' + repository.name + '/collaborators';
      request(url, function(err, response, body) {
        if (didWeFail) return;
        if (err) {
          didWeFail = true;
          return callback(err);
        }

        var collaborators = JSON.parse(body);
        output[fullname] = collaborators.length;
        if (++counter == total) {
          return callback(null, output);
        }
      });
    }
  });
};
