var fs = require('fs');
var data = fs.readFileSync('src/data/project.json', 'utf-8');
var project = JSON.parse(data);
var mxgraph = require('mxgraph')({
  mxBasePath: '../'
});
//prova per vedere se prende il valore dal file .json
alert("id dell'oggetto nel file .json:" + project.number);
mxBasePath = 'javascript/src/';

function main(container) {

  var graph = new msGraph(container);

  new mxRubberband(graph);

  graph.getModel().beginUpdate();

  try {
    var v1 = graph.insertVertex(parent, null, "Hello", 20, 20, 80, 30);
    var v2 = graph.insertVertex(parent, null, project.number, 20, 20, 80, 30);
    var e1 = graph.insertEdge(parent, null, " ", v1, v2);
  }
  finally {
    graph.getModel().endUpdate();
  }
}
