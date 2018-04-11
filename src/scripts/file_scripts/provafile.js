$function() {
  var people = [];

  $.getJSON('src/data/project.json', function(data) {
    $.each(data.task, function(i, f) {
      var tblRow = "<tr><td>" + f.number + "</td><td>" + f.title + "</td><td>" + f.start_date + "</td><td>" + f.end_date + "</td></tr>";
      $(tblRow).appendTo("#userdata tbody");

    });
  });
});
