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
      const obj = document.querySelector(`.${className} h4`);
      obj.textContent = Object.values(state).join(', ');
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

  // let instances = {};
  // class CheckboxStateManager {
  //   constructor (className) {
  //     this.state = {};
  //     this.container = document.querySelector(`.${className}`);
  //     this.header = this.container.querySelector('h4');
  //     this.container.addEventListener('click', this.update.bind(this));
  //   }

  //   update (event) {
  //     const checkbox = event.target;
  //     if (checkbox.tagName === 'INPUT' && checkbox.type === 'checkbox') {
  //       const id = checkbox.dataset.id;
  //       const name = checkbox.dataset.name;
  //       const checked = checkbox.checked;
  //       // class names: [city, state, amenity]
  //       const classN = checkbox.className;
  //       const key = `${classN}.${id}`;
  //       if (checked) {
  //         this.state[key] = name;
  //       } else {
  //         delete this.state[key];
  //       }
  //       filters = { ...filters, ...this.state };
  //       console.log(obj);
  //       this.updateHeader();
  //     }
  //   }

  //   updateHeader () {
  //     this.header.textContent = Object.values(this.state).join(', ');
  //   }

  //   getState () {
  //     return this.state;
  //   }
  // }

  // // Usage example
  // const amenities = new CheckboxStateManager('amenities');
  // const locations = new CheckboxStateManager('locations');

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
