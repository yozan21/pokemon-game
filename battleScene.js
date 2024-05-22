let draggle;
let emby;

const battleBackgroundImage = new Image();
battleBackgroundImage.src = "images/battleBackground.png";

const battleBackground = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  image: battleBackgroundImage,
});

let queue;
let renderedSprites;

function initBattle() {
  document.querySelector("#userInterface").style.display = "block";
  document.querySelector("#dialogueBox").style.display = "none";
  document.querySelector("#enemyHealthBar").style.width = "100%";
  document.querySelector("#playerHealthBar").style.width = "100%";
  document.querySelector("#attacksBox").replaceChildren();

  draggle = new Monsters(monsters.Draggle);
  emby = new Monsters(monsters.Emby);
  queue = [];
  renderedSprites = [draggle, emby];

  emby.attacks.forEach((attack) => {
    const button = document.createElement("button");
    button.innerHTML = attack.name;
    document.querySelector("#attacksBox").append(button);
  });

  //event listeners for attacks
  document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", (e) => {
      const selectedAttack = attacks[e.currentTarget.innerHTML];
      // console.log(selectedAttack);
      //player attacks
      emby.attack({
        attack: selectedAttack,
        recipient: draggle,
        renderedSprites,
      });
      if (draggle.health <= 0) {
        queue.push(() => {
          draggle.faint();
        });
        queue.push(() => {
          gsap.to("#overlappingDiv", {
            opacity: 1,
            onComplete: () => {
              cancelAnimationFrame(battleAnimationId);
              animate();
              document.querySelector("#userInterface").style.display = "none";
              gsap.to("#overlappingDiv", {
                opacity: 0,
              });
              battle.initiated = false;
              audio.Map.play();
            },
          });
        });
        return;
      }
      //enemy attacks
      const randomAttack =
        draggle.attacks[Math.floor(Math.random() * draggle.attacks.length)];
      queue.push(() => {
        draggle.attack({
          attack: randomAttack,
          recipient: emby,
          renderedSprites,
        });
      });

      console.log(queue);
    });
    button.addEventListener("mouseenter", (e) => {
      const selectedAttack = attacks[e.currentTarget.innerHTML];
      document.querySelector("#attackType").innerHTML = selectedAttack.type;
      document.querySelector("#attackType").style.color = selectedAttack.color;
    });
    button.addEventListener("mouseleave", (e) => {
      document.querySelector("#attackType").innerHTML = "Attack Type";
      document.querySelector("#attackType").style.color = "black";
    });
  });
}

let battleAnimationId;
function animateBattle() {
  battleAnimationId = window.requestAnimationFrame(animateBattle);
  battleBackground.draw();

  renderedSprites.forEach((sprite) => {
    sprite.draw();
  });
}

// initBattle();
// animateBattle();

document.querySelector("#dialogueBox").addEventListener("click", (e) => {
  if (queue.length > 0) {
    queue[0]();
    queue.shift();
    if (emby.health <= 0) {
      queue.push(() => {
        emby.faint();
      });
      // emby.faint();
      queue.push(() => {
        gsap.to("#overlappingDiv", {
          opacity: 1,
          onComplete: () => {
            cancelAnimationFrame(battleAnimationId);
            animate();
            document.querySelector("#userInterface").style.display = "none";
            gsap.to("#overlappingDiv", {
              opacity: 0,
            });
            battle.initiated = false;
            audio.Map.play();
          },
        });
      });
      return;
    }
  } else e.currentTarget.style.display = "none";

  // console.log(queue);
  //   console.log(e.currentTarget);
});
