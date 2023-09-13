const widthHealth = 250;

const zombies = [
  { id: 1, maxHealth: 20, image: 'assets/zombies/zombie.png'},
  { id: 2, maxHealth: 150, image: 'assets/zombies/zombie1.png'},
  { id: 3, maxHealth: 200, image: 'assets/zombies/zombie2.png'},
  { id: 4, maxHealth: 500, image: 'assets/zombies/zombie3.png'},
];

let weapons = [
  { name: "Baseball bat", cost: 10, gps: 1, owned: 0, image: 'assets/weapons/Baseball_bat.png'},
  { name: "Revolver", cost: 100, gps: 2, owned: 0, image: 'assets/weapons/Revolver.png'},
  { name: "Shotguns", cost: 500, gps: 5, owned: 0, image: 'assets/weapons/Shotguns.png'},
  { name: "Ray Gun", cost: 50000, gps: 50, owned: 0, image: 'assets/weapons/Raygun.png' },
];

let currentZombieId = 0;
let currentZombieHealth = 0;

let currentFoodsOwned = 0;
let currentUserGps = 0;
let currentClickCount = 2;

let totalWeaponsOwned = 0;

document.addEventListener('DOMContentLoaded', function() {
  displayUserInfos();
  displayShopInitialInfos();
  displayZombieInfos();
});

function displayUserInfos() {
  document.getElementById('userGps').textContent = currentUserGps;
  document.getElementById('foods').textContent = currentFoodsOwned;
  document.getElementById('owned').textContent = totalWeaponsOwned;
}

function displayShopInitialInfos() {
  const idTableWeapons = document.getElementById('tableWeapons');
  idTableWeapons.innerHTML = '';

  for (let i = 0; i < weapons.length; i++) {
    const { name, cost, gps, owned, image } = weapons[i];

    const objectElement = document.createElement('div');
    objectElement.classList.add('weaponInfosContainer');

    objectElement.innerHTML = `
      <p class="textShop">${name}<br>
        Cost: <span id="weaponCost${i}">${cost}</span><br>
        Gps: <span id="weaponGps${i}">${gps}</span><br>
        Owned: <span id="weaponOwned${i}">${owned}</span>
      </p>
      <img class="imageShop" src="${image}" />
      <button class="buttonShop" onClick="handleWeaponPurchase(${i})">Buy</button>
    `;

    idTableWeapons.appendChild(objectElement);
  }
}

function displayZombieInfos() {
  const { maxHealth, image:imageZombie } = zombies[currentZombieId]

  currentZombieHealth = maxHealth;
  document.getElementById("health").innerHTML = maxHealth + "hp";
  document.getElementById('imageZombie').setAttribute('src', imageZombie);
}

const zombieButton = document.getElementById('zombieButton')
zombieButton.addEventListener('click', function(event) {
  const { pageY, pageX } = event

  handleClickingAnimation(pageY, pageX);

  updatingUserInfos();
});

function handleClickingAnimation(pageY, pageX) {
  const pointAnimation = document.createElement("div");
  pointAnimation.setAttribute('class', 'points');
  pointAnimation.textContent = "+" + currentClickCount;
  pointAnimation.style.top = pageY + 'px';
  pointAnimation.style.left = pageX + 'px';

  zombieButton.appendChild(pointAnimation);

  let position = pageY;

  const id = setInterval(time, 2);

  function time() {
    if (position === 350) {
      clearInterval(id);
      return;
    }

    position--;
    pointAnimation.style.top = position + "px";
  };

  setTimeout(function(){
    zombieButton.removeChild(pointAnimation)
  }, 500);
}

function updatingUserInfos() {
  currentFoodsOwned += currentClickCount;
  currentZombieHealth -= currentClickCount;

  const documentHealth = document.getElementById("health");

  let widthDocumentHealth = 250;
  let colorDocumentHealth = "green";

  if (currentZombieHealth <= 0) {
    currentZombieId++;

    if (currentZombieId === 4) {
      currentZombieId = 0;
    }

    const { image:imageZombie, maxHealth } = zombies[currentZombieId];

    document.getElementById('imageZombie').setAttribute('src', imageZombie);
    currentZombieHealth = maxHealth;

  } else {
    const { maxHealth } = zombies[currentZombieId];

    const isRed = (maxHealth / 4);
    const isOrange = (maxHealth / 2);

    if ((currentZombieHealth <= isOrange) && (currentZombieHealth >= isRed)) {
      colorDocumentHealth = "orange";
    } else if (currentZombieHealth <= isRed) {
      colorDocumentHealth = "red";
    };

    widthDocumentHealth = (currentZombieHealth / maxHealth) * (widthHealth - (currentClickCount + 1));
  }

  documentHealth.innerHTML = currentZombieHealth + "hp";
  documentHealth.style.backgroundColor = colorDocumentHealth;
  documentHealth.style.width = widthDocumentHealth + "px";

  document.getElementById('foods').textContent = currentFoodsOwned;
}

function handleStartingGame() {
  setInterval(function(){
    currentFoodsOwned += currentUserGps;
    document.getElementById('foods').textContent = currentFoodsOwned;
  },1000);

  document.getElementById('start').style.display = 'none';
}

function handleWeaponPurchase(index) {
  const { cost, owned, gps } = weapons[index];

  if (currentFoodsOwned < cost) {
    return;
  }

  currentFoodsOwned -= cost;
  totalWeaponsOwned += 1;
  currentUserGps += gps;

  const newOwnedValue = (owned + 1)

  if ((newOwnedValue === 25) || (newOwnedValue === 50) || (newOwnedValue === 100) || (newOwnedValue === 250) || (newOwnedValue === 1000)) {
    const newGpsValue = (gps * 2);
    
    weapons[index].gps = newGpsValue;
    document.getElementById(`weaponGps${index}`).textContent = newGpsValue;
  }

  const newCostValue = Math.floor(cost * 1.15);

  weapons[index].owned = newOwnedValue;
  weapons[index].cost = newCostValue;

  document.getElementById(`weaponCost${index}`).textContent = newCostValue;
  document.getElementById(`weaponOwned${index}`).textContent = newOwnedValue;

  if ((totalWeaponsOwned % 50) === 0) {
    currentClickCount *= 2;
  }

  displayUserInfos();
}

function saveUserContent() {
  localStorage.setItem("minionsString", JSON.stringify(weapons));
  localStorage.setItem("currentFoodsOwned", currentFoodsOwned);
  localStorage.setItem("currentUserGps", currentUserGps);
  localStorage.setItem("currentClickCount", currentClickCount);
  localStorage.setItem("totalWeaponsOwned", totalWeaponsOwned);
}

function loadUserContent() {
  weapons = JSON.parse(localStorage.getItem("minionsString"));

  currentFoodsOwned = parseInt(localStorage.getItem("currentFoodsOwned"));
  currentUserGps = parseInt(localStorage.getItem("currentUserGps"));
  currentClickCount = parseInt(localStorage.getItem("currentClickCount"));
  totalWeaponsOwned = parseInt(localStorage.getItem("totalWeaponsOwned"));

  displayUserInfos();
  displayShopInitialInfos();
}