
// ------------------------------------------
//  FETCH FUNCTIONS
// -------------------------------------

function fetchData(url) {
  return fetch(url)
    .then(checkStatus)
    .then(res => res.json())
    .catch(error => console.log('Looks llike there was a problem!', error));
}

  fetchData('https://randomuser.me/api/?page=1&results=12&seed=employee')
  .then(data => {
    const employees = data.results;
    generateCards(employees)
    generateModal(employees)
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

function generateCards(employees) {
  const galleryDiv = document.getElementById('gallery');
  galleryDiv.innerHTML = '';
    employees.forEach(card => {
      const cardHtml =
          `<div class="card">
              <div class="card-img-container">
                  <img class="card-img" src= ${card.picture.large} alt="profile picture">
              </div>
              <div class="card-list-container">
                  <h3 id="name" class="card-name cap"> ${card.name.first} </h3>
                  <p class="card-text"> ${card.email} </p>
                  <p class="card-text cap"> ${card.location.city}, ${card.location.state} </p>
              </div>
          </div> `;

        galleryDiv.insertAdjacentHTML("beforeend", cardHtml);
    })
}

function generateModal(employees){
  const cardDiv = document.querySelectorAll('.card');
  
  cardDiv.forEach( item => {
  item.addEventListener( "click", () => {

    const modalDiv = document.createElement("div");
    modalDiv.className = 'modal-container';
    
    const modalHtml =
      ` <div class="modal">
          <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src= "https://placehold.it/125x125" alt="profile picture">
                <h3 id="name" class="modal-name cap">name</h3>
                <p class="modal-text">email</p>
                <p class="modal-text cap">city</p>
                <hr>
                <p class="modal-text">(555) 555-5555</p>
                <p class="modal-text">123 Portland Ave., Portland, OR 97204</p>
                <p class="modal-text">Birthday: 10/21/2015</p>
            </div>
        </div>`;
    document.body.appendChild(modalDiv).insertAdjacentHTML('afterbegin', modalHtml);

    const modalCloseBtn = document.getElementById('modal-close-btn');
    modalCloseBtn.addEventListener('click', () => {
      modalDiv.remove();
    })
  })
})

}