const grid = document.querySelector(".grid");
const resultDisplay = document.querySelector(".results");
const width = 15;
let currentShooterIndex = 202;
let direction = 1;
let goingRight = true;
let aliensRemoved = [];

for (let i = 0; i < 255; i++) {
  const square = document.createElement('div');
  grid.appendChild(square);
}

// we cannot use push method on a nodeList (without making it an array)
const squares = Array.from(document.querySelectorAll(".grid div"));

const alienInvaders = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
  15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
  30, 31, 32, 33, 34, 35, 36, 37, 38, 39
]

function draw() {
  // includes method does not work with the index used in for in
  alienInvaders.forEach((_, i) => {
    if (!aliensRemoved.includes(i)) {
      squares[alienInvaders[i]].classList.add("invader");
    }
  })
}

draw();

function remove() {
  for (const i in alienInvaders) {
    squares[alienInvaders[i]].classList.remove("invader");
  }
}

squares[currentShooterIndex].classList.add("shooter");

function moveShooter(e) {
  squares[currentShooterIndex].classList.remove("shooter");
  switch (e.key) {
    case "ArrowLeft":
      if (currentShooterIndex % width !== 0) {
        currentShooterIndex--;
      }
      break;
    case "ArrowRight":
      if (currentShooterIndex % width < width - 1) {
        currentShooterIndex++;
      }
      break;
  }
  squares[currentShooterIndex].classList.add("shooter");
}

document.addEventListener("keydown", moveShooter);

function moveInvaders() {
  const leftEdge = alienInvaders[0] % width === 0;
  const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1;
  remove();

  if (rightEdge && goingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width + 1;
      direction = -1;
      goingRight = false;
    }
  }

  if (leftEdge && !goingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width - 1;
      direction = 1;
      goingRight = true;
    }
  }

  for (const i in alienInvaders) {
    alienInvaders[i] += direction;
  }
  draw();

  if (squares[currentShooterIndex].classList.contains("invader", "shooter")) {
    resultDisplay.textContent = "Game Over!"
    clearInterval(invadersId);
  }

  for (const i in alienInvaders) {
    if (alienInvaders[i] >= squares.length) {
      resultDisplay.textContent = "Game Over!";
      clearInterval(invadersId);
    }
  }
  if (aliensRemoved.length === alienInvaders.length) {
    resultDisplay.textContent = "You Won!";
    clearInterval(invadersId);
  }
}

let invadersId = setInterval(moveInvaders, 150);

function shoot(e) {
  let laserId;
  let currentLaserIndex = currentShooterIndex;

  function moveLaser() {
    try {
      squares[currentLaserIndex].classList.remove("laser");
      currentLaserIndex -= width;
      squares[currentLaserIndex].classList.add("laser");
      if (squares[currentLaserIndex].classList.contains("invader")) {
        squares[currentLaserIndex].classList.remove("invader");
        squares[currentLaserIndex].classList.remove("laser");
        clearInterval(laserId);

        const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
        aliensRemoved.push(alienRemoved);
      }
    } catch (e) {
    }
  }

  switch (e.key) {
    case " ":
      setInterval(moveLaser, 100);
  }
}

document.addEventListener("keydown", shoot);

