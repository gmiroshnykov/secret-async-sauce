var findUnicorns = require('./find-unicorns-named');

findUnicorns(function(err, unicorns) {
  if (err) throw err;

  console.log('Found unicorns:');
  console.log(unicorns);
});
