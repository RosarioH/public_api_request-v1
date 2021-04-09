
// ------------------------------------------
//  FETCH FUNCTIONS
// -------------------------------------

function fetchData(url) {
  return fetch(url)
    .then(checkStatus)
    .then(res => res.json())
    .catch(error => console.log('Looks like there was a problem!', error));
}

fetchData('https://randomuser.me/api/?results=12')
  .then(data => {
    const dataList = data.results
    generateCards(dataList)
    browseModal(dataList)
  })

function checkStatus(response) {
  if (response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}

// ------------------------------------------
//  HELPER FUNCTIONS
// ------------------------------------------

function generateCards(dataList) {
  const galleryDiv = document.getElementById('gallery');
  galleryDiv.innerHTML = '';
  dataList.forEach(employee => {
    const cardHtml =
      `<div class="card" id="${employee.email}">
                <div class="card-img-container">
                    <img class="card-img" src= ${employee.picture.large} alt="profile picture">
                </div>
                <div class="card-list-container">
                    <h3 id="name" class="card-name cap"> ${employee.name.first} ${employee.name.last} </h3>
                    <p class="card-text"> ${employee.email} </p>
                    <p class="card-text cap"> ${employee.location.city}, ${employee.location.state}</p>
                </div>
            </div> `;
    galleryDiv.insertAdjacentHTML("beforeend", cardHtml);
  })
}

function generateModal() {
  const modalDiv = document.createElement("div");
  modalDiv.className = 'modal-container';
  document.body.appendChild(modalDiv);

  const modalHtml =
    ` <div class="modal">
          <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            
            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        </div>`;

  modalDiv.insertAdjacentHTML('afterbegin', modalHtml);
  // Trigger close modal
  const modalCloseBtn = document.getElementById('modal-close-btn');
  modalCloseBtn.addEventListener('click', () => { modalDiv.remove() })
}

function browseModal(data, index) {
  //Add listener to each cards
  const cardDiv = document.querySelectorAll('.card');
  for (let i = 0; i < cardDiv.length; i++) {
    cardDiv[i].addEventListener('click', () => {
      index = data.indexOf(data[i]);
      generateModal()
      const prevButton = document.querySelector('#modal-prev');
      const nextButton = document.querySelector('#modal-next');
      //Update the modal info of selected card
      modalInfoUpdate(data[i])

      if (index < 0) {
        prevButton.disabled = true;
      }

      //Added listener for next/prev buttons
      [nextButton, prevButton].forEach(button => {
        button.addEventListener('click', (e) => {
          const clickedButton = e.target;
          const modalContainer = document.querySelector('.modal-info-container');
          if (clickedButton.id == 'modal-next') {
            index++;
            if (index <= data.length) {
              modalContainer.remove();
              modalInfoUpdate(data[index]);
            }
            if (index === data.length - 1) {
              nextButton.disabled = true;
            } else if (index < data.length) {
              prevButton.disabled = false;
            }
          }
           else if (clickedButton.id == 'modal-prev') {
            index--;
            if (index <= -1) {
              index = -1;
            } else if (index <= data.length) {
              modalContainer.remove();
              modalInfoUpdate(data[index]);
              nextButton.disabled = false;
            };
          }
        })
      })
    })
  }
}

function formatPhoneNumber(phoneNumberString) {
  const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return "(132) 159 - 6244";
}

function modalInfoUpdate(employee) {
  const modalContainer = document.querySelector('.modal-btn-container');
  const modalEmployeeInfo =
    `<div class="modal-info-container">
              <img class="modal-img" src= ${employee.picture.large} alt="profile picture">
              <h3 id="name" class="modal-name cap">${employee.name.first} ${employee.name.last}</h3>
              <p class="modal-text">${employee.email}</p>
              <p class="modal-text cap">${employee.location.city}</p>
              <hr>
              <p class="modal-text">${formatPhoneNumber(employee.phone)}</p>
              <p class="modal-text">${employee.location.street.number} ${employee.location.street.name}, ${employee.location.city}, OR ${employee.location.postcode}</p>
              <p class="modal-text">Birthday: ${moment(employee.dob.date).format("MMMM D YYYY")}</p>
            </div>`;
            //Used moment CDN for library to filter birthdays 
  modalContainer.insertAdjacentHTML('beforebegin', modalEmployeeInfo);
}