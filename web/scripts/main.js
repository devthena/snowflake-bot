$(document).ready(function () {

  var serverUpdates = {
    mods: {},
    roles: {},
    channels: {}
  };

  var pathname = window.location.pathname;
  switch (pathname) {
    case '/commands':
      $('.link-commands').addClass('selected');
      break;
    case '/faq':
      $('.link-faq').addClass('selected');
      break;
  }

  // listeners for redirecting

  $('.logo-text').click(function () {
    window.location.reload();
  });

  $('.snow-login').click(function (e) {
    e.preventDefault();
    window.location = '/auth/discord';
  });

  $('.snow-logout').click(function (e) {
    e.preventDefault();
    window.location = '/logout';
  });

  $('.server').click(function (e) {
    var serverID = $(e.currentTarget).attr('id');
    window.location = '/dashboard/' + serverID;
  });

  $('.btn-dash').click(function (e) {
    window.location = '/dashboard/';
  });

  // listeners for server settings updates

  $('.switch').click(function (e) {

    var $switch = $(e.currentTarget);
    var name = $switch.attr('name');
    var $el = $('.switch-box').find('.' + name);

    $el.animate({ height: 'toggle' });
    $('.btn-save').attr('disabled', false);
  });

  $('input,textarea').keyup(function (e) {
    $('.btn-save').attr('disabled', false);
  });

  $('.btn-save').click(function (e) {
    e.preventDefault();
    $('.btn-save').attr('disabled', true);

    // get values from input checkboxes
    var switches = $('.switch');
    for (var i = 0; i < switches.length; i++) {
      var name = switches[i].name;
      var value = switches[i].checked;
      serverUpdates['mods'][name] = value;
    }

    // get values from inputs
    setFormValues('input[type="text"]');
    setFormValues('textarea');

    // build the parameters for api call
    var guildID = $('.view-server').prop('id');
    var data = {
      id: guildID,
      updates: serverUpdates
    };

    $.post(
      '/api/server/update',
      data,
      function (data, status, xhr) {
        if (data.success) {
          notifyServer('green', 'Successfully updated server settings');
        } else if (data.error) {
          notifyServer('red', data.error);
        } else {
          notifyServer('red', 'Something went wrong. Please try again later.');
        }
      }
    );
  });

  function setFormValues(selector) {

    var inputs = $(selector);

    for (var i = 0; i < inputs.length; i++) {
      var name = inputs[i].name.split(':');
      var type = name[0];
      var key = name[1];
      var value = inputs[i].value;
      serverUpdates[type][key] = value;
    }
  }

  function notifyServer(color, message) {
    $('.server-notif').css('color', color);
    $('.server-notif').text(message);
    $('.server-notif').fadeIn(500).delay(2000).fadeOut(500);
  }
});
