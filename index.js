var findUnicorns = require('./find-unicorns-named');

var githubToken = '78bea3c9ab59165a670ee62c1756866d0f097f5a';
findUnicorns(githubToken, function(err, unicorns) {
  if (err) throw err;

  console.log('Found unicorns:');
  console.log(unicorns);
});
