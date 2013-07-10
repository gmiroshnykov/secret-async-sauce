request = require('request')
async = require('async')

module.exports = (githubToken, callback) ->
  keyword = 'unicorns';

  findRepositoriesByKeyword = (keyword, callback) ->
    url = 'https://api.github.com/legacy/repos/search/' + keyword
    getJson url, (err, json) ->
      return callback err if err

      repositories = json.repositories
      return callback null, repositories

  countCollaboratorsOfRepositories = (repositories, callback) ->
    async.map repositories, countCollaboratorsOfRepository, (err, bits) ->
      return callback err if err

      reducer = (memo, bit, cb) ->
        memo[bit.repository] = bit.count
        return cb null, memo

      async.reduce bits, {}, reducer, callback

  countCollaboratorsOfRepository = (repository, callback) ->
    fullname = repository.owner + '/' + repository.name
    url = 'https://api.github.com/repos/' + fullname + '/collaborators';
    getJson url, (err, collaborators) ->
      return callback err if err

      return callback null,
        repository: fullname
        count: collaborators.length

  getJson = (url, callback) ->
    options =
      headers:
        'User-Agent': process.title + ' ' + process.version,
        'Authorization': 'bearer ' + githubToken

    request.get url, options, (err, response, body) ->
      return callback err if err
      return callback new Error(body) if response.statusCode != 200
      return callback null, JSON.parse body



  #
  # here goes the main code
  #
  async.waterfall [
    async.apply(findRepositoriesByKeyword, keyword),
    countCollaboratorsOfRepositories
  ], callback
