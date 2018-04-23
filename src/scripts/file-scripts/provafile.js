var fs = require('fs');
var data = fs.readFileSync('src/data/project.json', 'utf-8');
var project = JSON.parse(data);

function calc(n1, n2){
  return (parseInt(n1, 10) + parseInt(n2, 10));
}

function sistema(){
  var rect = document.getElementById("rettangolo");
  var text = document.getElementById("testo");
  var rect_x = window.getComputedStyle(rect, null).getPropertyValue("x");
  var rect_y = window.getComputedStyle(rect, null).getPropertyValue("y");
  text.setAttribute("x", calc(rect_x, "10px"));
  text.setAttribute("y", calc(rect_y, "35px"));
  text.innerHTML = project.title;
}
