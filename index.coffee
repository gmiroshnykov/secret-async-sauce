findUnicorns = require './find-unicorns.coffee'

githubToken = '78bea3c9ab59165a670ee62c1756866d0f097f5a'
findUnicorns githubToken, (err, unicorns) ->
  throw err if err

  console.log 'Found unicorns:'
  console.log unicorns
