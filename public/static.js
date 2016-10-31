$(document).ready(function() {
    $('#get-data').click(function() {



    });

    $("#testForm").submit(function(event) {

        //var data= $('input[name=tName]').val();
        var data = "tName=" + $('input[name=tName]').val();
        console.log(data);
        //var data="tName=copyofperiodic";
        //   $.getJSON('/query', data, function (data, status) {
        // if (status === 200) {
        //     alert("SUCESSSSSS!!!");
        // }
        // });
        //   return true;
        $.ajax({
                type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
                url: '/query', // the url where we want to POST
                data: data, // our data object
                dataType: 'json', // what type of data do we expect back from the server
                encode: true
            })
            // using the done promise callback (if successful)
            .done(function(data) {

                $.makeTable = function(mydata) {
                    var table = $('<table border=1>');
                    var tblHeader = "<tr>";
                    for (var k in mydata[0]) tblHeader += "<th>" + k + "</th>";
                    tblHeader += "</tr>";
                    $(tblHeader).appendTo(table);
                    $.each(mydata, function(index, value) {
                        var TableRow = "<tr>";
                        $.each(value, function(key, val) {
                            TableRow += "<td>" + val + "</td>";
                        });
                        TableRow += "</tr>";
                        $(table).append(TableRow);
                    });
                    return ($(table));
                };

                var mydata = eval(data);
                var table = $.makeTable(mydata);
                $(table).appendTo("#info");
                // log data to the console so we can see
                //console.log(data);

                // here we will handle errors and validation messages
            });

        // stop the form from submitting the normal way and refreshing the page
        event.preventDefault();

    });


});
