

$('#btn').click(function() {
      var SUMMONER_NAME = "";
      SUMMONER_NAME = $("#userName").val().replace(/ /g, "").toLowerCase();





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

                  $("#sLevel").css("color", "black"); 
                  $("#sLevel").html(summonerLevel);
                },
              error: function (XMLHttpRequest, textStatus, errorThrown) {

                  $("#sLevel").html("summoner name not found");
                  $("#sLevel").css("color", "red"); 

              }
          });
      } else {}
});