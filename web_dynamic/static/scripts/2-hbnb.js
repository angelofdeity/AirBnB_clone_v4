const api = 'http://0.0.0.0:5001/api/v1/status/';
$.get(api, (data, textStatus) => {
  if (textStatus) {
    $('div#api_status').addClass('available');
  }
});
