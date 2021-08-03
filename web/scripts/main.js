$(document).ready(function () {

  var serverUpdates = {
    channels: {},
    mods: {},
    roles: {},
    settings: {}
  };

  var pathname = window.location.pathname;
  switch (pathname) {
    case '/commands':
      $('.nav-commands').addClass('selected');
      break;
    case '/faq':
      $('.nav-faq').addClass('selected');
      break;
    case '/dashboard':
      $('.nav-profile').addClass('selected');
      break;
  }

  // listeners for redirecting

  $('.logo').click(function () {
    window.location = '/';
  });

  $('.login').click(function (e) {
    e.preventDefault();
    window.location = '/auth/discord';
  });

  $('.logout').click(function (e) {
    e.preventDefault();
    window.location = '/logout';
  });

  $('.server').click(function (e) {
    var serverId = e.currentTarget.dataset.serverId;
    window.location = '/dashboard/' + serverId;
  });

  // listeners for server settings updates

  $('.switch').click(function (e) {
    $('.save').attr('disabled', false);
  });

  $('input').keyup(function (e) {
    $('.save').attr('disabled', false);
  });

  $('.save').click(function (e) {
    e.preventDefault();
    $('.save').attr('disabled', true);

    // get values from input checkboxes
    var switches = $('.switch');
    for (var i = 0; i < switches.length; i++) {
      var name = switches[i].name;
      var value = switches[i].checked;
      serverUpdates['mods'][name] = value;
    }

    // get values from inputs
    setFormValues();

    // build the parameters for api call
    var el = document.getElementById('settings');
    var serverData = {
      id: el.dataset.serverId,
      updates: serverUpdates
    };

    $.post(
      '/api/server/update',
      serverData,
      function (data, status, xhr) {
        if (data.success) {
          notifyServer('#008000', 'Successfully updated server settings!');
        } else if (data.error) {
          notifyServer('#DC143C', 'Something went wrong. Please try again later.');
          console.error(data.error);
        } else {
          notifyServer('#DC143C', 'Something went wrong. Please try again later.');
        }
      }
    );
  });

  function setFormValues() {

    var inputs = $('input[type="text"]');

    for (var i = 0; i < inputs.length; i++) {
      var name = inputs[i].name.split(':');
      var type = name[0];
      var key = name[1];
      var value = inputs[i].value;
      serverUpdates[type][key] = value;
    }
  }

  function notifyServer(color, message) {
    $('.save-notice').css('color', color);
    $('.save-notice').text(message);
    $('.save-notice').fadeIn(500).delay(2000).fadeOut(500);
  }
});
