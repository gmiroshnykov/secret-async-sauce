var request = require('request'),
    async = require('async');

module.exports = function(githubToken, callback) {
  var keyword = 'unicorns';

  return async.waterfall([
    async.apply(findRepositoriesByKeyword, keyword),
    countCollaboratorsOfRepositories
  ], callback);

  function findRepositoriesByKeyword(keyword, callback) {
    var url = 'https://api.github.com/legacy/repos/search/' + keyword;
    getJson(url, function(err, json) {
      if (err) return callback(err);

      var repositories = json.repositories;
      return callback(null, repositories);
    });
  }

  function countCollaboratorsOfRepositories(repositories, callback) {
    async.map(repositories, countCollaboratorsOfRepository, function(err, bits) {
      if (err) return callback(err);

      async.reduce(bits, {}, function(memo, bit, cb) {
        memo[bit.repository] = bit.count;
        return cb(null, memo);
      }, callback);
    });
  }

  function countCollaboratorsOfRepository(repository, callback) {
    var fullname = repository.owner + '/' + repository.name;
    var url = 'https://api.github.com/repos/' + fullname + '/collaborators';
    getJson(url, function(err, collaborators) {
      if (err) return callback(err);

      var result = {
        repository: fullname,
        count: collaborators.length
      };
      return callback(null, result);
    });
  }

  function getJson(url, callback) {
    var options = {
      headers: {
        'User-Agent': process.title + ' ' + process.version,
        'Authorization': 'bearer ' + githubToken
      }
    };

    request.get(url, options, function(err, response, body) {
      if (err) return callback(err);
      if (response.statusCode !== 200) {
        return callback(new Error(body));
      }
      return callback(null, JSON.parse(body));
    });
  }
};
