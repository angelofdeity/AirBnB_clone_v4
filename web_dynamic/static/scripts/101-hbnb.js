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
    placesSection.innerHTML = '';
    fetchData(filters, searchPlacesUrl)
      .then(data => {
        displayPlaces(data);
      })
      .catch((error) => console.error('Failed to fetch places:', error));
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
  fetchData({}, searchPlacesUrl)
    .then(data => {
      displayPlaces(data);
    })
    .catch((error) => console.error('Failed to fetch places:', error));
}

function fetchData (data, url) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then((response) => response.json());
}
function displayPlaces (places) {
  const placesSection = document.querySelector('section.places');

  for (const place of places) {
    const reviewsUrl = `http://0.0.0.0:5001/api/v1/places/${place.id}/reviews`;
    const [newPlace, btn] = createPlaceArticle(place);
    fetch(reviewsUrl)
      .then(response => response.json())
      .then(reviews => {
        const reviewsList = document.createElement('ul');
        reviewsList.classList.add('lists', 'hidden');
        for (const review of reviews) {
          const userUrl = `http://0.0.0.0:5001/api/v1/users/${review.user_id}`;
          fetch(userUrl)
            .then(response => response.json())
            .then(user => {
              const username = user.first_name + ' ' + user.last_name;
              reviewsList.appendChild(createReview(review, username));
              newPlace.appendChild(reviewsList);
            })
            .catch((error) => console.error('Failed to fetch user:', error));
        }
        displayReviews(btn, reviewsList);
      })
      .catch((error) => console.error('Failed to fetch reviews:', error));

    placesSection.appendChild(newPlace);
  }
  return placesSection;
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
  // Create the reviews container element
  const reviewsContainer = document.createElement('div');
  reviewsContainer.className = 'reviews';

  // Create the reviews heading element
  const reviewsHeading = document.createElement('h2');
  reviewsHeading.id = 'reviewHeading';
  reviewsHeading.textContent = 'Reviews';

  // Create the reviews "show" span element
  const reviewsShowSpan = document.createElement('span');
  reviewsShowSpan.textContent = ' show';

  reviewsHeading.appendChild(reviewsShowSpan);
  reviewsContainer.appendChild(reviewsHeading);
  article.append(titleBox, info, description, reviewsContainer);
  return [article, reviewsShowSpan];
}
function displayReviews (btn, reviews) {
  btn.addEventListener('click', () => {
    if (reviews.classList.contains('hidden')) {
      reviews.classList.remove('hidden');
      btn.textContent = ' hide';
    } else {
      reviews.classList.add('hidden');
      btn.textContent = ' show';
    }
  });
}

function createReview (review, username) {
  // Create a review item element
  const reviewItem = document.createElement('li');

  // Create the review heading element
  const reviewHeading = document.createElement('h3');
  reviewHeading.textContent = `From ${username} the ` + dateFormat(review.updated_at);

  // Create the review content element
  const reviewContent = document.createElement('p');
  reviewContent.innerHTML = review.text;

  // Add the review heading and content to the review item element
  reviewItem.appendChild(reviewHeading);
  reviewItem.appendChild(reviewContent);

  return reviewItem;
}

function dateFormat (dateString) {
  // Create a new date object from the input string
  const dateObj = new Date(dateString);

  // Array of month names
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // Get the day, month, and year from the date object
  const day = dateObj.getDate();
  const monthIndex = dateObj.getMonth();
  const year = dateObj.getFullYear();

  // Format the date as "day <suffix> month year"
  let suffix = 'th';
  if (day === 1 || day === 21 || day === 31) {
    suffix = 'st';
  } else if (day === 2 || day === 22) {
    suffix = 'nd';
  } else if (day === 3 || day === 23) {
    suffix = 'rd';
  }
  const formattedDate = `${day}${suffix} ${monthNames[monthIndex]} ${year}`;

  return formattedDate;
}
