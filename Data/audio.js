const audio = {
  Map: new Howl({
    src: "./audio/map.wav",
    volume: 0.1,
    loop: true,
  }),
  initBattle: new Howl({
    src: "./audio/initBattle.wav",
    volume: 0.05,
  }),
  Battle: new Howl({
    src: "./audio/battle.mp3",
    volume: 0.05,
    loop: true,
  }),
  initFireball: new Howl({
    src: "./audio/initFireball.wav",
    volume: 0.1,
  }),
  FireballHit: new Howl({
    src: "./audio/fireballHit.wav",
    volume: 0.1,
  }),
  TackleHit: new Howl({
    src: "./audio/tackleHit.wav",
    volume: 0.1,
  }),
  Victory: new Howl({
    src: "./audio/victory.wav",
    volume: 0.3,
  }),
};
