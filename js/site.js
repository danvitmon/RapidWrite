var events = [
  {
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 240000,
    date: "06/01/2017",
  },
  {
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 250000,
    date: "06/01/2018",
  },
  {
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 257000,
    date: "06/01/2019",
  },
  {
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 130000,
    date: "06/01/2017",
  },
  {
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 140000,
    date: "06/01/2018",
  },
  {
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 150000,
    date: "06/01/2019",
  },
  {
    event: "HeroesCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 40000,
    date: "06/01/2017",
  },
  {
    event: "HeroesCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 45000,
    date: "06/01/2018",
  },
  {
    event: "HeroesCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 50000,
    date: "06/01/2019",
  },
];

// build dropdown for specific cities
function buildDropDown() {
  let dropdownMenu = document.getElementById("eventDropDown");
  dropdownMenu.innerHTML = "";

  let currentEvents = getEventData();

  let cityNames = currentEvents.map((event) => event.city);
  let citiesSet = new Set(cityNames);
  let distinctCities = [...citiesSet]; // ['Charlotte', 'San Diego']

  const dropdownTemplate = document.getElementById("dropdownItemTemplate");

  // copy the template
  let dropdownItemNode = document.importNode(dropdownTemplate.content, true);

  // make our changes
  let dropdownItemLink = dropdownItemNode.querySelector('a');
  dropdownItemLink.innerText = 'All Cities';
  dropdownItemLink.setAttribute('data-string', 'All');

  // add our copy to the page
  dropdownMenu.appendChild(dropdownItemNode);

  for (let i = 0; i < distinctCities.length; i += 1) {
    // get the city name
    let cityName = distinctCities[i];

    // generate a dropdown element
    let itemNode = document.importNode(dropdownTemplate.content, true);
    let anchorTag = itemNode.querySelector('a');
    anchorTag.innerText = cityName;
    anchorTag.setAttribute('data-string', cityName);

    // append it to the dropdown menu
    dropdownMenu.appendChild(itemNode);
  }

  displayEventData(currentEvents);
  displayStats(currentEvents);
  document.getElementById('location').innerText = 'All Events';
}

function displayEventData(currentEvents) {

  const eventTable = document.getElementById('eventTable');
  const template = document.getElementById('tableRowTemplate');

  eventTable.innerHTML = '';

  for (let i = 0; i < currentEvents.length; i++) {
    let event = currentEvents[i];
    let tableRow = document.importNode(template.content, true);

    tableRow.querySelector('[data-id="event"]').textContent = event.event;
    tableRow.querySelector('[data-id="city"]').textContent = event.city;
    tableRow.querySelector('[data-id="state"]').textContent = event.state;
    tableRow.querySelector('[data-id="attendance"]').textContent = event.attendance.toLocaleString();
    tableRow.querySelector('[data-id="date"]').textContent = new Date(event.date).toLocaleDateString();

    tableRow.querySelector('tr').setAttribute('data-event', event.id);

    eventTable.appendChild(tableRow);
  }
}

function calculateStats(currentEvents) {
  let total = 0;
  let average = 0
  let most = 0;
  let least = currentEvents[0].attendance;

  for (let i = 0; i < currentEvents.length; i++) {
    let currentAttendance = currentEvents[i].attendance;

    total += currentAttendance;

    if (currentAttendance > most) {
      most = currentAttendance;
    }

    if(currentAttendance < least) {
      least = currentAttendance;
    }
  }

  average = total / currentEvents.length;

  let stats = {
    total: total,
    average: average,
    most: most,
    least: least
  }

  return stats;
}

function displayStats(currentEvents) {
  let statistics = calculateStats(currentEvents);

  document.getElementById('total').textContent = statistics.total.toLocaleString();
  document.getElementById('average').textContent = Math.round(statistics.average).toLocaleString();
  document.getElementById('most').textContent = statistics.most.toLocaleString();
  document.getElementById('least').textContent = statistics.least.toLocaleString();
}

function getEventData() {
  let data = localStorage.getItem('jvSuperDogEventData');

  if (data == null) {
    let identifiedEvents = events.map((event) => {
      event.id = generateId();
      return event;
    });

    localStorage.setItem('jvSuperDogEventData', JSON.stringify(identifiedEvents));
    data = localStorage.getItem('jvSuperDogEventData');
  }

  let currentEvents = JSON.parse(data);

  if (currentEvents.some(event => event.id == undefined)) {

    currentEvents.forEach(event => event.id = generateId());

    localStorage.setItem('jvSuperDogEventData', JSON.stringify(currentEvents));

    // same as above if loop
    // for (let i = 0; i < currentEvents.length; i++) {
    //  let event = currentEvents[i];
    //
    //  event.id == generateId();
    }
    
  return currentEvents;
  }

function viewFilteredEvents(dropdownItem) {
  let cityName = dropdownItem.getAttribute('data-string');

  // get all my events
  let allEvents = getEventData();

  if (cityName == 'All') {
    displayStats(allEvents);
    displayEventData(allEvents);
    document.getElementById('location').innerText = 'All Events';

    return;
  }

  // filter those events to just the selected city
  let filteredEvents = allEvents.filter(event => event.city.toLowerCase() == cityName.toLowerCase());

  // same as above
  // let filteredEvents2 = allEvents.filter(
  //  function (event) {
  //  return event.city.toLowerCase() == cityName.toLowerCase();
  // });
  
  // display the stats for those events
  displayStats(filteredEvents);

  // change the stats header
  document.getElementById('location').innerText = cityName;

  // display only those events in the table
  displayEventData(filteredEvents);
}

function saveNewEvent() {
  // get the form input values
  let name = document.getElementById('newEventName').value;
  let city = document.getElementById('newEventCity').value;
  let attendance = parseInt(document.getElementById('newEventAttendance').value, 10);

  let dateValue = document.getElementById('newEventDate').value;
  dateValue = new Date(dateValue + ' 00:00');

  let date = dateValue.toLocaleDateString();

  let stateSelect = document.getElementById('newEventState');
  let selectedIndex = stateSelect.selectedIndex;
  let state = stateSelect.options[selectedIndex].text;

  // create a new event object
  let newEvent = {
    event: name,
    city: city,
    state: state,
    attendance: attendance,
    date: date,
    id: generateId()
  };

  // add it to the array of current events
  let events = getEventData();
  events.push(newEvent);

  // then, save the array with the new event
  localStorage.setItem('jvSuperDogEventData', JSON.stringify(events));

  buildDropDown();
  document.getElementById('newEventForm').clear();
}

function generateId() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

function editEvent(eventRow) {
  let eventId = eventRow.getAttribute('data-event');

  let currentEvents = getEventData();

  let eventToEdit = currentEvents.find(event => event.id == eventId);

  document.getElementById('editEventId').value = eventToEdit.id;
  document.getElementById('editEventName').value = eventToEdit.event;
  document.getElementById('editEventCity').value = eventToEdit.city;
  document.getElementById('editEventAttendance').value = eventToEdit.attendance;

  let eventDate = new Date(eventToEdit.date + ' 00:00');
  let eventDateString = eventDate.toISOString();
  let dateArray = eventDateString.split('T');
  let formattedDate = dateArray[0];

  
  document.getElementById('editEventDate').value = formattedDate;

  /*
  let stateSelect = document.getElementById('newEventState');
  let stateIndex = stateSelect.selectedIndex;
  let state = stateSelect.options[stateIndex].text;
  */

  let editStateSelect = document.getElementById('editEventState');

  let optionsArray = [...editStateSelect.options]

  let index = optionsArray.findIndex(option => eventToEdit.state == option.text);
  editStateSelect.selectedIndex = index // the index of the state for our event

  /* for loop to find the option
  for (let i = 0; i < editStateSelect.options.length; i++) {
    let option = editStateSelect.option[i];

    if (eventToEdit.state == option.text) {
      editStateSelect.selectedIndex = i;
    }
  } */
}

function deleteEvent() {
  let eventId = document.getElementById('editEventId').value;

  // get the events in local storage as an array
  let currentEvents = getEventData();
  // filter out any event(s) with that eventId
  let filteredEvents = currentEvents.filter(event => event.id != eventId);
  // save that array to local storage
  localStorage.setItem('jvSuperDogEventData', JSON.stringify(filteredEvents));

  buildDropDown();
}

function updateEvent() {
  let eventId = document.getElementById('editEventId').value;

  // get the form input values
  let name = document.getElementById('editEventName').value;
  let city = document.getElementById('editEventCity').value;
  let attendance = parseInt(document.getElementById('editEventAttendance').value, 10);

  let dateValue = document.getElementById('editEventDate').value;
  dateValue = new Date(dateValue);

  let date = dateValue.toLocaleDateString();

  let stateSelect = document.getElementById('editEventState');
  let stateIndex = stateSelect.selectedIndex;
  let state = stateSelect.options[stateIndex].text;

  // create a new event object
  let newEvent = {
    event: name,
    city: city,
    state: state,
    attendance: attendance,
    date: date,
    id: eventId
  };

  // get my events array
  let currentEvents = getEventData();
  // find the location of the OLD event with this ID
  let index = -1;
  for (let i = 0; i < currentEvents.length; i++) {
    if (currentEvents[i].id == eventId) {
      // replace that event with newEvent
      currentEvents[i] = newEvent;
      break;
    }
  }

  // save it in local storage
  localStorage.setItem('jvSuperDogEventData', JSON.stringify(currentEvents));

  buildDropDown();
}