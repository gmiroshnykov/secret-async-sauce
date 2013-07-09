var request = require('request'),
    async = require('async'),
    _ = require('underscore');

module.exports = function(callback) {
  return findRepositoriesByKeyword('unicorns', callback);
};

function findRepositoriesByKeyword(keyword, callback) {
  var url = 'https://api.github.com/legacy/repos/search/' + keyword;
  getJson(url, function(err, json) {
    if (err) return callback(err);

    var repositories = json.repositories;
    return countCollaboratorsOfRepositories(repositories, callback);
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

  var url = 'https://api.github.com/repos/' + repository.owner +
    '/' + repository.name + '/collaborators';
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
  var githubToken = '78bea3c9ab59165a670ee62c1756866d0f097f5a';
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
