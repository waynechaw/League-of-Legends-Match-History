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
          champ: match.participants[0].championId,
          result: match.participants[0].stats.winner,
          role: match.participants[0].timeline.role,
          lane: match.participants[0].timeline.lane,
          time: match.matchCreation
        })
      });

      transformTime(matchArray);



      


    }

  });
}

var transformTime = function(arr){
   



    $.ajax({
    url: '/map',
    type: 'POST',
    contentType: 'application/json',
    success: function(data) {

      //console.log (data);
      //console.log (arr);


      arr.forEach(function(match){
        match.champ = data.data[match.champ].name;
        match.time = match.time;
      });



      updateMatch(arr.sort(function(b, a){return a.time - b.time}));


    }
  });

}

var updateMatch = function(arr) {

  console.log(arr);

  arr.forEach(function(match){


    var newMatch = 
    {
      html: '<span class="bold">Champion:</span> ' + match.champ +  ' | <span class="bold">Result: </span>' + convertResult(match.result) + ' | <span class="bold">Role:</span> ' + match.role.toLowerCase() + ' | <span class="bold">Lane: </span>' + match.lane.toLowerCase() + '<br><hr>',
      time: match.time
    }

    $('.historyContainer').append(newMatch.html);



  });

  /*
  var newMatch = 
  {
    html: '<span class="bold">Champion:</span> ' + champName +  ' | <span class="bold">Result: </span>' + convertResult(result) + ' | <span class="bold">Role:</span> ' + role.toLowerCase() + ' | <span class="bold">Lane: </span>' + lane.toLowerCase() + '<br><hr>',
    time: time
  }

  $('.historyContainer').prepend(newMatch.html);

  */
}