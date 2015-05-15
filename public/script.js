$('#btn').click(function() {

  $('.historyContainer').html("");

      var SUMMONER_NAME = "";
      SUMMONER_NAME = $("#userName").val().replace(/ /g, "").toLowerCase();

      if (SUMMONER_NAME !== "") {

        var data = {};
        var summonerID;
        data.summonerName = SUMMONER_NAME;


          $.ajax({
              url: '/riot',
              type: 'POST',
              contentType: 'application/json',
              data: JSON.stringify(data),
              success: function(data) {

                  var summonerLevel = data[SUMMONER_NAME].summonerLevel;
                  summonerID = data[SUMMONER_NAME].id;

                  $("#sLevel").css("color", "black"); 
                  $("#sLevel").html(summonerLevel);

                  matchHistory(summonerID);
                },
              error: function (XMLHttpRequest, textStatus, errorThrown) {

                  $("#sLevel").html("summoner name not found");
                  $("#sLevel").css("color", "red"); 
              }
          });

      } else {

          $("#sLevel").html("Please enter summoner name");
          $("#sLevel").css("color", "red"); 

      }
});

var convertResult = function(str){
  alert(str);
  if (str == false){
    return "loss"
  }else{
    return "win"
  }
}

var prependMatch = function(champName, result, role, lane) {
  var newMatch = '<span class="bold">Champion:</span> ' + champName +  ' | <span class="bold">Result: </span>' + convertResult(result) + ' | <span class="bold">Role:</span> ' + role.toLowerCase() + ' | <span class="bold">Lane: </span>' + lane.toLowerCase() + '<br><hr>';

  $('.historyContainer').prepend(newMatch);
}

var addMatch = function(champName, result, role, lane){
  //alert(champName + " " + result + " " + role + " " + lane);

  var data = {};
  data.champID = champName;



  $.ajax({
    url: '/champ',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(data),
    success: function(data) {

      var champName = data.name;
      
      prependMatch(champName, result, role, lane)

    }

  });


}



var matchHistory = function(summonerID){

  var data = {};
  data.summonerID = summonerID;

  $.ajax({
    url: '/match',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(data),
    success: function(data) {

      
      data.matches.forEach(function(match){
        addMatch(match.participants[0].championId, match.participants[0].stats.winner, match.participants[0].timeline.role, match.participants[0].timeline.lane);
      });

      


    }

  });
}

