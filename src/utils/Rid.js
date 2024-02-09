'use strict';

function generateRid() {
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var length = 8;
  var rid = '';

  for (var i = 0; i < length; i++) {
    var randomIndex = Math.floor(Math.random() * characters.length);
    rid += characters.charAt(randomIndex);
  }
  return rid;
}

module.exports = { generateRid }