var findUnicorns = require('./find-unicorns');

findUnicorns(function(err, unicorns) {
  if (err) throw err;

  console.log('Found unicorns:');
  console.log(unicorns);
});
