// YOUR CODE HERE:

var App = function(){
};

App.prototype.init = function(){

};

App.prototype.send = function(username, message){
  var obj = {
    username: username,
    text: message,
    room: 'jail'
  }
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
  // Let's make a hash table for the characters we're escaping
  if(_.isString(str)){
  var hash = {
    // This will contain key/value pairs
    // Key = character we're escaping
    // Value = what it should encode to
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
  // Iterate over the string
  //
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

var fetch = function(){
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    data: {order: '-createdAt'}, //Can place object here
    contentType: 'application/json',
     success: function(data){
      // build out html elements, append to our index?
      _.each(data.results, function(message, index){
        $('.messages').append('<p>' + escape(message.username) + ': ' + escape(message.text) + '</p>');
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
}

$(document).ready(function(){
  $('.refresh').on('click', function(){
    fetch();
  });


  fetch();

  $('.post').on('click', function() {
    var userName = $('.username').val();
    var message = $('.chatMessage').val();

    // var mobj = {username: userName,
    //             text: message};
    app.send(userName, message);

  });
});
