fs = require('fs')
fs.readFile('../data/project.json', 'utf-8', function(err, data) {
  if(err) {
    return console.log(err);
  }
  console.log(data);
});
