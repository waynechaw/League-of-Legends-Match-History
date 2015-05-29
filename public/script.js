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
          champ: getChampName(match.participants[0].championId),
          result: match.participants[0].stats.winner,
          role: match.participants[0].timeline.role,
          lane: match.participants[0].timeline.lane,
          time: match.matchCreation
        })
      });
      updateMatch(matchArray);
    }
  });
}


var getChampName = function(id){
  return staticChampData.data[id].name;
}

var updateMatch = function(arr) {

  arr.forEach(function(match){
    var newMatch = '<span class="block"><span class="bold">Champion:</span> ' + match.champ +  '</span> | <span class="block2"><span class="bold">Result: </span>' + convertResult(match.result) + '</span> | <span class="block2"><span class="bold">Role:</span> ' + match.role.toLowerCase().replace("_", " ") + '</span> | <span class="bold">Lane: </span>' + match.lane.toLowerCase() + '<br><hr>';
    $('.historyContainer').prepend(newMatch);
  });

}