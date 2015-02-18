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
      console.log(data);
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



var app = new App();

var rooms = {};



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

var escape = function(str){
  if(_.isString(str)){
  var hash = {
    '&': '&amp',
    '<': '&lt',
    '>': '&gt',
    '"': '&quot',
    "'": '&#39',
    '`': '&#96',
    ' ': '&nbsp',
    '!': '&#33',
    '@': '&#64',
    '$': '&#36',
    '%': '&#37',
    '(': '&#40',
    ')': '&#41',
    '=': '&#61',
    '+': '&#35',
    '{': '&#123',
    '}': '&#125',
    '[': '&#91',
    ']': '&#93'
  }
  var results = '';
  var stringArr = str.split('');
  return _.map(stringArr, function(letter){
    if (hash[letter]){
      return hash[letter];
    } else {
      return letter;
    }
  }).join('');
  } else {
    return str;
  }
}

// 'where={"roomName":"lobby", "createdAt":{"$gte": {"__type": "Date", "iso": "2015-01-21T18:02:52.249Z" }}}'

App.prototype.fetch = function(roomName){
  $('p').remove();
  roomName = roomName || 'general'

  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    data: {where: JSON.stringify({roomname:roomName, order: -'createdAt'})},
    contentType: 'application/json',
     success: function(data){
      _.each(data.results, function(message, index){
          $('.messages').append('<p>' + '<a href="#">' + escape(message.username) + '</a>' + ': ' + escape(message.text) + '</p>');
      });

      var roomsArr = getRoomNames(data);

      _.each(roomsArr, function(elem){
        if (!rooms[elem]){
        $('select').append('<option>' + escape(elem) + '</option>');
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

var grabRoom = function() {
    var str = "";
    $( "select option:selected" ).each(function() {
      str += $( this ).text() + " ";
      return str;
    });
  };

var currentRoom;

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
    roomname: currentRoom
  }
  app.send(obj);
});

  //Listen for the user to click on the "create room" button
  $('.createRoom').on('click', function() {
    var room = prompt('Select your room\'s name');
    if (rooms[room]) {
      alert("A room with that name already exists");
    } else {
        currentRoom = room;
        var obj = {
          username: window.location.search.substring(10),
          text: $('.chatMessage').val(),
          roomname: currentRoom
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

  //Listen for the user to click on a username to add the person as a   friend
  $('a').on('click', function(event) {
    console.log('hi');
    console.log(event.text());
  });



});
