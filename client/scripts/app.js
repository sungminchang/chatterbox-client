//============== App Constructor and Methods =========//
var App = function(){
};

App.prototype.init = function(){

};

App.prototype.send = function(obj){

  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox/',
    type: 'POST',
    data: JSON.stringify(obj),
    contentType: 'application/json',
    success: function(data){
      console.log(obj);
      console.log('Chatterbox message sent!');
    },
    error: function(data){
      console.error('chatterbox: Failed to load message');
    }
  });
};

App.prototype.clearMessages = function() {
  $('#chats').children().remove();
};


//DO NOT USE THIS METHOD FOR ANYTHING ELSE BESIDES PASSING SPECRUNNER
//Does not escape the input
App.prototype.addMessage = function(message) {
  $('#chats').append('<p>' + message.username + ": " +
    message.text + '</p>');
};

App.prototype.addRoom = function(roomName) {
  $('#roomSelect').append('<div>' + roomName + '</div>');
};

App.prototype.addFriend = function() {

};

//============= END App constructor and methods =========//


var app, rooms, friends, currentRoom;

app = new App();
rooms = {};
friends = {};
currentRoom

var getRoomNames = function(arr) {
  return _.uniq(_.map(arr.results, function(e) {
    if (e.room){
      return e.room;
    } else if (e.roomname){
      return e.roomname;
    } else if (e.roomName){
      return e.roomName;
    } else {
      return 'general';
    }
  }));
};


// 'where={"roomName":"lobby", "createdAt":{"$gte": {"__type": "Date", "iso": "2015-01-21T18:02:52.249Z" }}}'
App.prototype.boldIfFriend = function(friend){
  if (friends.hasOwnProperty(friend)) {
    console.log("trying to make it bold sir");
    $('.messages p:last').css('font-weight', 'bold');
  }
};

App.prototype.addMessage = function(message) {
  $('.messages').append('<p></p>');
  $('.messages p:last').text(message.text);
  $('.messages p:last').prepend('<a href="#"></a>');
  $('.messages p:last a').text(message.username + ': ');
  app.boldIfFriend(message.username);
};

App.prototype.clearFriendsList = function() {
  friends = {};
};

App.prototype.fetch = function(roomName){
  $('p').remove();
  roomName = roomName || 'general'

  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    data: {order: '-createdAt'},
    contentType: 'application/json',
    success: function(data){
      _.each(data.results, function(message, index){

        if (message.roomname === roomName) {
          app.addMessage(message);
        } else if (roomName === 'general') {
          app.addMessage(message);
        } else {
          return;
        }
      
      });

      //Listen for the user to click on a username to add the person as a   friend
      $('a').on('click', function(event) {
        var name = $(event.target).text();
        if (!friends[name]){
          friends[name] = name;
        }
      });
      var roomsArr = getRoomNames(data);

      _.each(roomsArr, function(elem){
        if (!rooms[elem]){
          $('select').append('<option></option>');
          $('select option:last').text(elem);
        rooms[elem] = elem;
        };
      });

      console.dir(data);
    },
    error: function(data){
      console.error('chatterbox: Failed to load message');
    }
  });
};

$(document).ready(function(){
  //Initialize the page with messages
    app.fetch();

  //Listen for dropdown menu selections
  $( "select" ).change(function () {
      var str = "";
      $( "select option:selected" ).each(function() {
        str += $( this ).text();
        currentRoom = str;
        app.fetch(str);
      });
    })
    .change();

  //Listen for clicks on the refresh button
  $('.refresh').on('click', function(){
    app.fetch(currentRoom);
  });


  //Listen for clicks on the posting button
  $('.post').on('click', function() {
  // var userName = $('.username').val();
  var obj = {
    username: window.location.search.substring(10),
    text: $('.chatMessage').val(),
    roomname: $("select option:selected").text()
  }
  app.send(obj);
});

  //Listen for the user to click on the "create room" button
  $('.createRoom').on('click', function() {
    var room = prompt('Select your room\'s name');
    console.log(room);
    if (rooms.hasOwnProperty(room)) {
      alert("A room with that name already exists");
    } else {
        var obj = {
          username: window.location.search.substring(10),
          text: $('.chatMessage').val(),
          roomname: room
        };

      $.ajax({
        url: 'https://api.parse.com/1/classes/chatterbox/',
        type: 'POST',
        data: JSON.stringify(obj),
        contentType: 'application/json',
        success: function(data){
          app.fetch(currentRoom);
        },
        error: function(data){
          console.error('chatterbox: Failed to load message');
        }
      });

      }

  });





});
