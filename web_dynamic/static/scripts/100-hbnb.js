const searchPlacesUrl = 'http://0.0.0.0:5001/api/v1/places_search/';

document.addEventListener('DOMContentLoaded', () => {
  checkApiStatus();
  // function checkboxStateManager (className) {
  //   const state = {};
  //   function update (id, name, checked) {
  //     if (checked) {
  //       state[id] = name;
  //     } else {
  //       delete state[id];
  //     }
  //     updateHeader(className);
  //     // console.log('state:', Object.values(state));
  //   }
  //   function get () {
  //     return state;
  //   }
  //   function updateHeader (className) {
  //     const obj = document.querySelector(`.${className} h4`);
  //     obj.textContent = Object.values(state).join(', ');
  //   }
  //   return { update, get };
  // }
  // function getInfo (checkbox) {
  //   const id = checkbox.dataset.id;
  //   const name = checkbox.dataset.name;
  //   const checked = checkbox.checked;
  //   return [id, name, checked];
  // }
  // function handleCheckboxEvent (className) {
  //   const container = document.querySelector('.' + className);
  //   const stateManager = checkboxStateManager(className);
  //   const state = { ...stateManager.get() };
  //   console.log(Object.values(state));
  //   container.addEventListener('click', (event) => {
  //     if (event.target.type === 'checkbox') {
  //       const checkbox = event.target;
  //       stateManager.update(...getInfo(checkbox));
  //     }
  //   });
  //   return stateManager;
  // }
  // const amenities = handleCheckboxEvent('amenities');
  // const locations = handleCheckboxEvent('locations');
  // console.log(amenities.get());
  // const stateValues = { ...amenities.get() };
  // console.log(stateValues);

  let stateObjects = {};
  class CheckboxStateManager {
    constructor (className) {
      this.state = {};
      this.container = document.querySelector(`.${className}`);
      this.header = this.container.querySelector('h4');
      this.container.addEventListener('click', this.update.bind(this));
    }

    update (event) {
      const checkbox = event.target;
      if (checkbox.tagName === 'INPUT' && checkbox.type === 'checkbox') {
        const id = checkbox.dataset.id;
        const name = checkbox.dataset.name;
        const checked = checkbox.checked;
        const classN = checkbox.className;
        const key = `${classN}.${id}`;
        if (checked) {
          this.state[key] = name;
        } else {
          delete this.state[key];
        }
        stateObjects = { ...stateObjects, ...this.state };
        this.updateHeader();
      }
    }

    updateHeader () {
      this.header.textContent = Object.values(this.state).join(', ');
    }

    getState () {
      return this.state;
    }
  }
  function getIdList (className) {
    return Object.keys(stateObjects)
      .filter(key => key.includes(className))
      .map(key => key.split('.')[1]);
  }

  // Usage example
  const amenities = new CheckboxStateManager('amenities');
  const locations = new CheckboxStateManager('locations');

  // Filter place By Amenities
  const searchButton = document.querySelector('button');
  const placesSection = document.querySelector('section.places');
  searchButton.addEventListener('click', () => {
    const states = getIdList('state');
    const amenities = getIdList('amenity');
    const cities = getIdList('city');
    const stateObjects = { cities, states, amenities };
    placesSection.innerHTML = '';
    fetchPlaces(stateObjects);
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
