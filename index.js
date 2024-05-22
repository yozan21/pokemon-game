const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;
// console.log(gsap);
const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, i + 70));
}

const battleZoneMap = [];
for (let i = 0; i < battleZoneData.length; i += 70) {
  battleZoneMap.push(battleZoneData.slice(i, i + 70));
}

const boundaries = [];
const battleZones = [];
const offSet = {
  x: -740,
  y: -640,
};
collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025) {
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offSet.x,
            y: i * Boundary.height + offSet.y,
          },
        })
      );
    }
  });
});

battleZoneMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025) {
      battleZones.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offSet.x,
            y: i * Boundary.height + offSet.y,
          },
        })
      );
    }
  });
});

// console.log(battleZoneData);

const image = new Image();
image.src = "./images/PelletTown.png";

const foregroundImage = new Image();
foregroundImage.src = "./images/foreground.png";

const playerImageDown = new Image();
playerImageDown.src = "./images/playerDown.png";
const playerImageUp = new Image();
playerImageUp.src = "./images/playerUp.png";
const playerImageLeft = new Image();
playerImageLeft.src = "./images/playerLeft.png";
const playerImageRight = new Image();
playerImageRight.src = "./images/playerRight.png";

// canvas.width / 2 - playerImage.width / 4 / 2,
// canvas.height / 2 - playerImage.height / 2,

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 4 / 2,
    y: canvas.height / 2 - 68 / 2,
  },
  image: playerImageDown,
  frames: { max: 4, hold: 10 },
  sprites: {
    up: playerImageUp,
    down: playerImageDown,
    left: playerImageLeft,
    right: playerImageRight,
  },
});
const background = new Sprite({
  position: {
    x: offSet.x,
    y: offSet.y,
  },
  image: image,
});

const foreground = new Sprite({
  position: { x: offSet.x, y: offSet.y },
  image: foregroundImage,
});

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};
let lastKey = "";

const movables = [background, ...boundaries, foreground, ...battleZones];
function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  );
}
const battle = {
  initiated: false,
};
function animate() {
  const animationID = requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  background.draw();
  boundaries.forEach((boundary) => {
    boundary.draw();
  });
  battleZones.forEach((battleZone) => {
    battleZone.draw();
  });

  player.draw();
  foreground.draw();

  let moving = true;
  player.animate = false;
  if (battle.initiated) return;

  //activate a battle
  if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
    for (let i = 0; i < battleZones.length; i++) {
      const battleZone = battleZones[i];
      const overlappingArea =
        (Math.min(
          player.position.x + player.width,
          battleZone.position.x + battleZone.width
        ) -
          Math.max(player.position.x, battleZone.position.x)) *
        (Math.min(
          player.position.y + player.height,
          battleZone.position.y + battleZone.height
        ) -
          Math.max(player.position.y, battleZone.position.y));

      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: battleZone,
        })
      ) {
        if (
          overlappingArea > (player.width * player.height) / 2 &&
          Math.random() < 0.03
        ) {
          audio.Map.stop();
          audio.initBattle.play();
          audio.Battle.play();

          battle.initiated = true;
          window.cancelAnimationFrame(animationID);
          gsap.to("#overlappingDiv", {
            opacity: 1,
            repeat: 3,
            yoyo: true,
            duration: 0.4,
            onComplete() {
              gsap.to("#overlappingDiv", {
                opacity: 1,
                duration: 0.4,
                onComplete() {
                  initBattle();
                  animateBattle();
                  gsap.to("#overlappingDiv", {
                    opacity: 0,
                    duration: 0.4,
                  });
                },
              });
            },
          });
          break;
        }
      }
    }
  }
  //Move player
  if (keys.w.pressed && lastKey === "w") {
    player.animate = true;
    player.image = player.sprites.up;

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: { x: boundary.position.x, y: boundary.position.y + 3 },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving)
      movables.forEach((movable) => {
        movable.position.y += 3;
      });
  } else if (keys.a.pressed && lastKey === "a") {
    player.animate = true;
    player.image = player.sprites.left;

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: { x: boundary.position.x + 3, y: boundary.position.y },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving)
      movables.forEach((movable) => {
        movable.position.x += 3;
      });
  } else if (keys.s.pressed && lastKey === "s") {
    player.animate = true;
    player.image = player.sprites.down;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: { x: boundary.position.x, y: boundary.position.y - 3 },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving)
      movables.forEach((movable) => {
        movable.position.y -= 3;
      });
  } else if (keys.d.pressed && lastKey === "d") {
    player.animate = true;
    player.image = player.sprites.right;

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: { x: boundary.position.x - 3, y: boundary.position.y },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving)
      movables.forEach((movable) => {
        movable.position.x -= 3;
      });
  }
}
animate();

gsap.to("#startText", {
  duration: 0.8,
  y: -6,
  repeat: -1,
  ease: "sine",
  yoyo: true,
});
document.querySelector("#startDiv").addEventListener("click", (e) => {
  audio.Map.play();
  e.currentTarget.style.display = "none";
  window.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "w":
        keys.w.pressed = true;
        lastKey = "w";
        break;
      case "s":
        keys.s.pressed = true;
        lastKey = "s";

        break;
      case "d":
        keys.d.pressed = true;
        lastKey = "d";

        break;
      case "a":
        keys.a.pressed = true;
        lastKey = "a";

        break;
    }
  });
  window.addEventListener("keyup", (e) => {
    switch (e.key) {
      case "w":
        keys.w.pressed = false;
        break;
      case "s":
        keys.s.pressed = false;
        break;
      case "d":
        keys.d.pressed = false;
        break;
      case "a":
        keys.a.pressed = false;
        break;
    }
  });
});
