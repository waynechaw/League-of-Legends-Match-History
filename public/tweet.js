

$('#btn').click(function() {
      var SUMMONER_NAME = "";
      SUMMONER_NAME = $("#userName").val();



      if (SUMMONER_NAME !== "") {

        var data = {};
        data.summonerName = SUMMONER_NAME;


          $.ajax({
              url: '/riot',
              type: 'POST',
              contentType: 'application/json',
              data: JSON.stringify(data),
              success: function(data) {

                  var summonerLevel = data[SUMMONER_NAME].summonerLevel;

                  document.getElementById("sLevel").innerHTML = summonerLevel;
                },
              error: function (XMLHttpRequest, textStatus, errorThrown) {
                  alert("error getting Summoner data!");
              }
          });
      } else {}
});