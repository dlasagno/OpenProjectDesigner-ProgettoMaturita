var fs = require('fs');
var data = fs.readFileSync('../ProgettoEsame/src/data/project.json', 'utf-8');
var project = JSON.parse(data);
alert(project.number);
