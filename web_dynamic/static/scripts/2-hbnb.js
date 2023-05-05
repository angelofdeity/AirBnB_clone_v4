$(() => {
  const amenityDict = {};
  $("input[type='checkbox']").on('click', event => {
    const id = event.target.dataset.id;
    if (event.target.checked) {
      amenityDict[id] = event.target.dataset.name;
    } else {
      delete amenityDict[id];
    }
    $('.amenities h4').text(Object.values(amenityDict));
  });
  const api = 'http://0.0.0.0:5001/api/v1/status/';
  $.get(api, (data, textStatus) => {
    if (textStatus) {
      $('div#api_status').addClass('available');
    }
  });
});
