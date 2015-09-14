var animateLoading = function(){
  var load = setInterval(function () {
    if ($('#status').html() == "Loading..."){
      $('#status').html("Loading")
    }else{
      $('#status').append(".");
    }

    if (($('.historyContainer').html() != "")||($("#sLevel").html()=="summoner name not found")){
      clearInterval(load);
      $('#status').html("");
    }
 }, 400);
}

$('#btn').click(function() {
  $('.historyContainer').html("");
      var SUMMONER_NAME = "";
      SUMMONER_NAME = $("#userName").val().replace(/ /g, "").toLowerCase();
      if (SUMMONER_NAME !== "") {

        $('#status').html("Loading");
        animateLoading();

        var data = {};
        data.summonerName = SUMMONER_NAME;

          $.ajax({
              url: '/riot',
              type: 'POST',
              contentType: 'application/json',
              data: JSON.stringify(data),
              success: function(data) {
                  var summonerLevel = data[SUMMONER_NAME].summonerLevel;
                  var summonerID = data[SUMMONER_NAME].id;
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
  if (str == false){
    return "loss"
  }else{
    return "win"
  }
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

      var matchArray = [];

      data.matches.forEach(function(match){
        matchArray.push(
        {
          champ: getChampName(match.champion),
          //result: matchResult(match.matchId, summonerID),
          role: match.role,
          lane: match.lane,
          time: match.timestamp,
          matchID: match.matchId
        })
      });
      allMatchResult(matchArray, summonerID);
    }
  });
}

var allMatchResult = function(matchArray, summonerID){

  $.when(matchResult(matchArray[0].matchID, summonerID), matchResult(matchArray[1].matchID, summonerID), matchResult(matchArray[2].matchID, summonerID), matchResult(matchArray[3].matchID, summonerID), matchResult(matchArray[4].matchID, summonerID), matchResult(matchArray[5].matchID, summonerID), matchResult(matchArray[6].matchID, summonerID), matchResult(matchArray[7].matchID, summonerID), matchResult(matchArray[8].matchID, summonerID), matchResult(matchArray[9].matchID, summonerID)).done(function(r1, r2, r3, r4, r5, r6, r7, r8, r9, r10){


    var matches = [].concat(r1[0]).concat(r2[0]).concat(r3[0]).concat(r4[0]).concat(r5[0]).concat(r6[0]).concat(r7[0]).concat(r8[0]).concat(r9[0]).concat(r10[0]);




    matches.forEach(function(match, index){
      var participantID;
      var result;


      match.participantIdentities.forEach(function(participant){
        if (participant.player.summonerId == summonerID){
          participantID = participant.participantId;
        }
      });

      match.participants.forEach(function(participant){
        if (participant.participantId == participantID){
          result = participant.stats.winner;
        }
      });

      //console.log(participantID, result);

      match.result = result;
      matchArray[index].result = result;

    });

    updateMatch (matchArray);




  });


}

var matchResult = function(matchID, summonerID){

  var data = {};
  data.matchID = matchID;

  return $.ajax({
    url: '/result/' + matchID,
    type: 'GET',
    contentType: 'application/json',
    success: function(data) {


      var participant;

      data.participantIdentities.forEach(function(participant){
        if (participant.player.summonerId == summonerID){
          participant = participant.participantID;
        }
      });

      return participant;

    }
  });
}



var getChampName = function(id){
  return staticChampData.data[id].name;
}

var updateMatch = function(arr) {

  arr.forEach(function(match){
    var newMatch = '<span class="block"><span class="bold">Champion:</span> ' + match.champ +  '</span> | <span class="block2"><span class="bold">Result: </span>' + convertResult(match.result) + '</span> | <span class="block2"><span class="bold">Role:</span> ' + match.role.toLowerCase().replace("_", " ") + '</span> | <span class="bold">Lane: </span>' + match.lane.toLowerCase() + '<br><hr>';
    $('.historyContainer').append(newMatch);
  });

}