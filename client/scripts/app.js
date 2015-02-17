// YOUR CODE HERE:

var App = function(){
};

App.prototype.init = function(){

};

App.prototype.send = function(){

}

var app = new App();

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
    "'": '&apos',
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
    data: 'JSON',
    contentType: 'application/json',
    success: function(data){
      // build out html elements, append to our index?
      _.each(data.results, function(message, index){
        $('.messages').append('<p>' + escape(message.username) + ': ' + escape(message.text) + '</p>');
      })
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
});
