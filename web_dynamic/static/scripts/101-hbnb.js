const searchPlacesUrl = 'http://0.0.0.0:5001/api/v1/places_search/';

document.addEventListener('DOMContentLoaded', () => {
  checkApiStatus();
  let instances = {};
  function checkboxStateManager (className) {
    const state = {};
    function update (key, name, checked) {
      if (checked) {
        state[key] = name;
      } else {
        delete state[key];
      }
      instances = { ...instances, ...state };
      updateHeader(className);
    }
    function get () {
      return state;
    }
    function updateHeader (className) {
      const header = document.querySelector(`.${className} h4`);
      header.textContent = Object.values(state).join(', ');
    }
    return { update, get };
  }
  function handleCheckboxEvent (className) {
    const container = document.querySelector('.' + className);
    const stateManager = checkboxStateManager(className);
    container.addEventListener('click', (event) => {
      if (event.target.type === 'checkbox') {
        const checkbox = event.target;
        const name = checkbox.dataset.name;
        const checked = checkbox.checked;
        const key = `${checkbox.className}.${checkbox.dataset.id}`;
        stateManager.update(key, name, checked);
      }
    });
    return stateManager;
  }
  handleCheckboxEvent('amenities');
  handleCheckboxEvent('locations');

  // class names: [city, state, amenity]
  function getIdList (className) {
    return Object.keys(instances)
      .filter(key => key.includes(className))
      .map(key => key.split('.')[1]);
  }

  // Filter place By Amenities
  const searchButton = document.querySelector('button');
  const placesSection = document.querySelector('section.places');
  searchButton.addEventListener('click', () => {
    const states = getIdList('state');
    const amenities = getIdList('amenity');
    const cities = getIdList('city');
    const filters = { cities, states, amenities };
    console.log(filters);
    console.log(instances);
    placesSection.innerHTML = '';
    fetchPlaces(filters);
  });
});
function checkApiStatus () {
  const statusApi = 'http://0.0.0.0:5001/api/v1/status/';
  fetch(statusApi).then((response) => {
    if (response.ok) {
      const apiStatus = document.querySelector('#api_status');
      apiStatus.classList.add('available');
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
      const placesSection = document.querySelector('section.places');

      for (const place of places) {
        const newPlace = createPlaceArticle(place);
        placesSection.appendChild(newPlace);
      }
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

function createReviews (review) {
  // Create the reviews container element
  const reviewsContainer = document.createElement('div');
  reviewsContainer.className = 'reviews';

  // Create the reviews heading element
  const reviewsHeading = document.createElement('h2');
  reviewsHeading.textContent = 'Reviews';

  // Create the reviews "show" span element
  const reviewsShowSpan = document.createElement('span');
  reviewsShowSpan.textContent = 'show';
  reviewsHeading.appendChild(reviewsShowSpan);

  // Create the reviews list element
  const reviewsList = document.createElement('ul');

  // Create a review item element
  const reviewItem = document.createElement('li');

  // Create the review heading element
  const reviewHeading = document.createElement('h3');
  reviewHeading.textContent = 'From Bob Dylan the 27th January 2017';

  // Create the review content element
  const reviewContent = document.createElement('p');
  reviewContent.textContent = 'I had the best sex ever here😉';

  // Add the review heading and content to the review item element
  reviewItem.appendChild(reviewHeading);
  reviewItem.appendChild(reviewContent);

  // Add the review item to the reviews list
  reviewsList.appendChild(reviewItem);

  // Add the reviews heading and list to the reviews container
  reviewsContainer.appendChild(reviewsHeading);
  reviewsContainer.appendChild(reviewsList);

  return reviewsContainer;
}
