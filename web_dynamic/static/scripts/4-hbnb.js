const searchPlacesUrl = 'http://0.0.0.0:5001/api/v1/places_search/';
const amenityDict = {};
document.addEventListener('DOMContentLoaded', () => {
  checkApiStatus();
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  const amenities = document.querySelector('.amenities h4');
  function handleCheckbox(checkbox) {
    const id = checkbox.dataset.id;
    if (checkbox.checked) {
      amenityDict[id] = checkbox.dataset.name;
    } else {
      delete amenityDict[id];
    }
    updateAmenities();
  }
  checkboxes.forEach(checkbox => {
    handleCheckbox(checkbox);
    checkbox.addEventListener('click', () => handleCheckbox(checkbox));
  });
  function updateAmenities() {
    amenities.textContent = Object.values(amenityDict).join(', ');
  }
  updateAmenities();
  // Filter place By Amenities
  const searchButton = document.querySelector('button');
  const placesSection = document.querySelector('section.places');
  searchButton.addEventListener('click', () => {
    const amenities = { amenities: Object.keys(amenityDict) };
    placesSection.innerHTML = '';
    fetchPlaces(amenities);
  });
});
function checkApiStatus () {
  const statusApi = 'http://0.0.0.0:5001/api/v1/status/';
  fetch(statusApi).then((response) => {
    if (response.ok) {
      $('div#api_status').addClass('available');
    }
  });
  fetchPlaces({});
}

function fetchPlaces (data) {
  fetch(searchPlacesUrl, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then((response) => response.json())
    .then((places) => {
      const count = 0;
      const placesSection = document.querySelector('section.places');
      for (const place of places) {
        const newPlace = createPlaceArticle(place);
        placesSection.appendChild(newPlace);
      }
      console.log(count);
    })
    .catch((error) => console.error('Failed to fetch places:', error));
}

function createPlaceArticle (place) {
  const article = document.createElement('article');
  const titleBox = document.createElement('div');
  titleBox.className = 'title_box';
  const placeName = document.createElement('h2');
  placeName.textContent = place.name;
  const priceByNight = document.createElement('div');
  priceByNight.className = 'price_by_night';
  priceByNight.textContent = '$' + place.price_by_night;
  titleBox.append(placeName, priceByNight);

  const info = document.createElement('div');
  info.className = 'information';
  const maxGuest = document.createElement('div');
  maxGuest.className = 'max_guest';
  maxGuest.textContent = place.max_guest + ' Guest(s)';
  const numberRooms = document.createElement('div');
  numberRooms.className = 'number_rooms';
  numberRooms.textContent = place.number_rooms + ' Bedroom(s)';
  const numberBathrooms = document.createElement('div');
  numberBathrooms.className = 'number_bathrooms';
  numberBathrooms.textContent = place.max_guest + ' Bathroom(s)';
  info.append(maxGuest, numberRooms, numberBathrooms);

  const description = document.createElement('div');
  description.innerHTML = place.description;
  article.append(titleBox, info, description);
  return article;
}
