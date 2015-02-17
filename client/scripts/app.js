
var App = function(){
};

App.prototype.init = function(){

};

App.prototype.send = function(username, message, roomname){
  roomname = roomname || 'general';
  var obj = {
    username: username,
    text: message,
    roomname: roomname
  };

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

var fetch = function(roomName){
  $('p').remove();
  roomName = roomName || 'general'

  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    data: {order: '-createdAt'},
    contentType: 'application/json',
     success: function(data){
      _.each(data.results, function(message, index){
        if (roomName === 'general'){
          $('.messages').append('<p>' + escape(message.username) + ': ' + escape(message.text) + '</p>');
        } else if (message.roomname === roomName){
          $('.messages').append('<p>' + escape(message.username) + ': ' + escape(message.text) + '</p>');
        } else {
          return;
        }
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

fetch();

$( "select" ).change(function () {
    var str = "";
    $( "select option:selected" ).each(function() {
      str += $( this ).text();
      currentRoom = str;
      fetch(str);
    });
  })
  .change();

  $('.refresh').on('click', function(){
    fetch(currentRoom);
  });

  $('.post').on('click', function() {
  var userName = $('.username').val();
  var message = $('.chatMessage').val();
  var roomname = currentRoom;
  app.send(userName, message);
});

  $('.createRoom').on('click', function() {
    var room = prompt('Select your room\'s name');
    if (rooms[room]) {
      alert("A room with that name already exists");
    } else {
      var userName = $('.username').val();
      var message = $('.chatMessage').val();
      var roomname = room
      var obj = {
        username: userName,
        text: message,
        roomname: roomname
      };


      $.ajax({
        url: 'https://api.parse.com/1/classes/chatterbox/',
        type: 'POST',
        data: JSON.stringify(obj),
        contentType: 'application/json',
        success: function(data){
          console.log("successful post");
          fetch(currentRoom);
          console.log("executed fetch after post");
        },
        error: function(data){
          console.error('chatterbox: Failed to load message');
        }
      });

      }

      app.send(userName, message, roomname);
      fetch(roomname);
  });
});
