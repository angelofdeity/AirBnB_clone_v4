const statusApi = 'http://0.0.0.0:5001/api/v1/status/';
$.get(statusApi, (data, textStatus) => {
  if (textStatus) {
    $('div#api_status').addClass('available');
  }
});
const searchPlacesUrl = 'http://0.0.0.0:5001/api/v1/places_search/';
const places = document.querySelector('section.places');
fetch(searchPlacesUrl, {
  method: 'POST',
  headers: {
    'Content-type': 'application/json'
  },
  body: JSON.stringify({})
})
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
  });
