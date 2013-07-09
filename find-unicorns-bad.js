var request = require('request');

module.exports = function(githubToken, callback) {
  var r = request.defaults({
    headers: {
      'User-Agent': process.title + ' ' + process.version,
      'Authorization': 'bearer ' + githubToken
    }
  });

  var url = 'https://api.github.com/legacy/repos/search/unicorns';
  r.get(url, function(err, response, body) {
    if (err) return callback(err);
    if (response.statusCode !== 200) {
      return callback(new Error(body));
    }

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
      r.get(url, function(err, response, body) {
        if (didWeFail) return;
        if (err) {
          didWeFail = true;
          return callback(err);
        }

        if (response.statusCode !== 200) {
          return callback(new Error(body));
        }

        var collaborators = JSON.parse(body);
        output[this.fullname] = collaborators.length;
        if (++counter == total) {
          return callback(null, output);
        }
      }.bind({fullname: fullname}));
    }
  });
};
