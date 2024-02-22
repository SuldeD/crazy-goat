"use client";
import { assets } from "./assets.js";
import FlappyBird from "./FlappyBird";
import Phaser from "phaser";
import { store } from "../context/store.js";
import { decrement } from "../context/counterSlice.js";
import { triggerModal } from "../context/modalSlice.js";
import { GetInitials } from "../services/Home.js";
import { update, updateBan } from "../context/gameSlice.js";
import { makeHash } from "../utils/helpers.js";
import Cookies from "universal-cookie";
import axios from "axios";

const cookies = new Cookies();
const jwtToken = cookies.get("jwtToken");

let firstTry = false;
let roundScore = 0;
let interval = null;
let shouldWait = false;

const accounts = await ethereum.request({ method: "eth_accounts" });
const player = accounts[0];

let user_id = "";
let check_str = "";
let mid_check_str_history = [];
let mid_check_str = "";

class FlappyBirdScene extends Phaser.Scene {
  constructor(tour_id, life, updateTournomentDetailData) {
    super("FlappyBird");
    this.tour_id = tour_id;
    this.life = life;
    this.updateTournomentDetailData = updateTournomentDetailData;
  }

  preload() {
    let game = this;

    // scene assets
    this.load.image(
      assets.scene.background.day,
      "/assets/images/s2/background-day.png"
    );
    this.load.image(
      assets.scene.background.night,
      "/assets/images/s2/background-night.png"
    );
    this.load.spritesheet(
      assets.scene.ground,
      "/assets/images/s2/ground-sprite.png",
      {
        frameWidth: 336,
        frameHeight: 112,
      }
    );

    this.load.image(assets.scene.startGame, "/assets/images/s2/startgame_.png");
    this.load.image(assets.scene.gameOver, "/assets/images/gameover.png");
    this.load.image(
      assets.scene.restartGame,
      "/assets/images/restart-button_.png"
    );
    this.load.image(assets.scene.buyMNFT, "/assets/images/lives_.png");

    [assets.obstacle.pipe.green, assets.obstacle.pipe.red].forEach(function (
      pipe
    ) {
      game.load.image(pipe.top, `/assets/images/${pipe.top}.png`);
      game.load.image(pipe.bottom, `/assets/images/${pipe.bottom}.png`);
    });

    Object.keys(assets.bird).forEach(function (key) {
      let bird = assets.bird[key].name;
      game.load.spritesheet(bird, `/assets/images/${bird}-sprite_.png`, {
        frameWidth: 34,
        frameHeight: 24,
      });
    });
    this.load.image(assets.scoreboard.score, "/assets/images/score_.png");
  }

  create() {
    let game = this;

    this.soundPoint = new Audio("/assets/audio/point.wav");
    this.soundDie = new Audio("/assets/audio/die.wav");
    this.soundHit = new Audio("/assets/audio/hit.wav");
    this.soundSwoosh = new Audio("/assets/audio/swoosh.wav");
    this.soundWing = new Audio("/assets/audio/wing.wav");

    // background
    this.backgroundDay = this.add
      .image(assets.scene.width, 256, assets.scene.background.day)
      .setInteractive();
    this.backgroundNight = this.add
      .image(assets.scene.width, 256, assets.scene.background.night)
      .setInteractive();
    this.backgroundNight.visible = false;

    this.gaps = this.physics.add.group();
    this.pipes = this.physics.add.group();

    Object.keys(assets.bird).forEach(function (key) {
      game.anims.create({
        key: assets.bird[key].clapWings,
        frames: game.anims.generateFrameNumbers(assets.bird[key].name, {
          start: 0,
          end: 2,
        }),
        frameRate: 10,
        repeat: -1,
      });

      game.anims.create({
        key: assets.bird[key].stop,
        frames: [
          {
            key: assets.bird[key].name,
            frame: 1,
          },
        ],
        frameRate: 20,
      });
    });

    // ground
    this.ground = this.physics.add.sprite(
      assets.scene.width,
      468,
      assets.scene.ground
    );
    this.ground.setCollideWorldBounds(true);
    this.ground.setDepth(20);

    // ajust collision box for the ground
    this.ground.setSize(0, 100, 0, 0).setOffset(0, 10);

    this.anims.create({
      key: assets.animation.ground.moving,
      frames: this.anims.generateFrameNumbers(assets.scene.ground, {
        start: 0,
        end: 2,
      }),
      frameRate: 30,
      repeat: -1,
    });

    this.anims.create({
      key: assets.animation.ground.moving,
      frames: [
        {
          key: assets.scene.ground,
          frame: 0,
        },
      ],
      frameRate: 20,
    });

    // start, over, repeat
    this.start = this.add.image(
      assets.scene.width,
      156,
      assets.scene.startGame
    );
    this.start.setDepth(30);
    this.start.visible = false;

    this.gameOver = this.add.image(
      assets.scene.width,
      100,
      assets.scene.gameOver
    );
    this.gameOver.setDepth(20);
    this.gameOver.visible = false;

    this.restart = this.add
      .image(assets.scene.width, 300, assets.scene.restartGame)
      .setInteractive();
    this.buyMNFT = this.add
      .image(assets.scene.width, 350, assets.scene.buyMNFT)
      .setInteractive();
    this.buyMNFT.setDepth(40);
    this.restart.setDepth(20);
    this.buyMNFT.visible = false;
    this.restart.visible = false;
    this.buyMNFT.on("pointerdown", () => {
      store.dispatch(triggerModal(true));
    });
    this.restart.on("pointerdown", () => {
      this.restartGame(this);
    });

    this.scoreboard = this.add.image(
      assets.scene.width,
      200,
      assets.scoreboard.score
    );
    this.scoreboard.scale = 0.5;
    this.scoreboard.setDepth(30);

    this.scoreTxt = this.add.text(assets.scene.width, 40, "0", {
      fontFamily: "Nineteen",
      fontSize: "34px",
      fill: "#fff",
      stroke: "#000",
      strokeThickness: 4,
      strokeLinecap: "square",
      shadow: {
        offsetX: 2.5,
        offsetY: 3,
        color: "#000",
        blur: 0,
        stroke: true,
        fill: true,
      },
    });
    this.scoreTxt.setDepth(30);
    this.scoreTxt.setOrigin(0.5);
    this.scoreTxt.alpha = 0;

    this.scored = this.add.text(assets.scene.width, 215, "0", {
      fontFamily: "Nineteen",
      fontSize: "16px",
      fill: "#fff",
      stroke: "#000",
      strokeThickness: 3,
    });
    this.scored.setDepth(30);
    this.scored.setOrigin(0.5);

    this.spaceKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.initGame();

    const interval = setInterval(() => {
      const { counter } = store.getState();

      if (counter.lives !== 0 && this.buyMNFT.visible === true) {
        this.buyMNFT.visible = false;
      }
    }, 1000);

    return () => clearInterval(interval);
  }

  async getHomePage() {
    const res = await GetInitials();

    const { data } = res;

    if (res.return_code === 2031) {
      store.dispatch(updateBan(res.data?.end_date));
    }

    store.dispatch(update(data));
  }

  update() {
    if (this.isGameOver) {
      return;
    }
    if (!this.hasGameStarted) {
      return;
    }

    this.flappyBird.falls();

    this.pipes.children.iterate(function (pipe) {
      if (pipe == undefined) return;
      if (pipe.x < -50) pipe.destroy();
      else pipe.setVelocityX(-100);
    });

    this.gaps.children.iterate(function (gap) {
      gap.body.setVelocityX(-100);
    });

    this.nextPipes++;

    if (this.nextPipes === 120) {
      this.makePipes();
      this.nextPipes = 0;
    }

    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.flapBird();
    }
  }

  initGame() {
    this.nextPipes = 0;
    this.score = 0;
    this.dieSound = 0;
    this.isGameOver = false;
    this.currentPipe = assets.obstacle.pipe.green;

    this.start.visible = true;
    this.gameOver.visible = false;
    this.scoreboard.visible = false;
    this.scored.visible = false;
    // this.bestScore.visible = false;
    this.backgroundDay.visible = true;
    this.backgroundNight.visible = false;
    this.currentPipe = assets.obstacle.pipe.green;
    this.flappyBird = new FlappyBird(this, 60, 265);

    this.input.on(
      "pointerdown",
      function () {
        this.flapBird();
      },
      this
    );

    this.physics.add.collider(
      this.flappyBird,
      this.ground,
      this.hitBird,
      null,
      this
    );

    this.physics.add.overlap(
      this.flappyBird,
      this.pipes,
      this.hitBird,
      null,
      this
    );
    this.physics.add.overlap(
      this.flappyBird,
      this.gaps,
      this.updateScore,
      null,
      this
    );
    this.ground.anims.play(assets.animation.ground.moving, true);
  }

  flapBird() {
    if (this.isGameOver) {
      return;
    }

    // if (0) {
    // this.getInfo();
    if (!this.hasGameStarted) {
      !firstTry && store.dispatch(decrement());
      this.startGame();
    }

    this.soundWing.play();
    this.flappyBird.flap();
    // }
  }

  saveScore() {
    this.scored.setText(this.score);
    this.scored.visible = true;
  }

  async onFinishGame(score) {
    clearInterval(interval);
    try {
      const makeHashParams = [
        user_id.toString(),
        score.toString(),
        check_str,
        ...mid_check_str_history.map((item) => item.toString()),
      ];
      let back_str = await makeHash(makeHashParams, score);
      console.log("life: ", this.life);

      let data = JSON.stringify({
        tour_id: this.tour_id,
        toy_id: 1,
        point: score,
        check_str: check_str,
        back_str: back_str,
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://api-game.mongolnft.com/api/gameend-web3/",
        headers: {
          Authorization: `JWT ${jwtToken}`,
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios.request(config).then((response) => {
        console.log(JSON.stringify(response.data));
        this.life == 1 && window.location.reload();
      });
      mid_check_str_history = [];
      back_str = "";
    } catch (error) {
      console.log(error);
    }
    // clearInterval(interval);
    interval = null;
    this.gameStartInfo = null;
  }

  hitBird() {
    // when bird hits
    this.pipes.children.iterate(function (pipe) {
      if (pipe == undefined) {
        return;
      }
      pipe.setVelocityX(0);
    });

    if (!this.isGameOver) {
      if (!shouldWait) {
      }
      this.onFinishGame(roundScore);
      console.log(roundScore);
      // store.dispatch(incrementByAmount(roundScore));

      roundScore = 0;

      // const state = store.getState();
      // if (state.counter?.lives === 0) this.buyMNFT.visible = 1;
      // if(.counter.lives)
    }

    this.saveScore();
    this.isGameOver = true;
    this.scoreboard.visible = true;
    this.hasGameStarted = false;
    this.flappyBird.die();
    this.ground.anims.stop(assets.animation.ground.moving, true);
    this.gameOver.visible = true;
    this.restart.visible = true;
    this.scoreTxt.setText("");

    // break;
    if (this.dieSound == 0) {
      this.soundHit.play();
      this.soundDie.play();
      this.dieSound = 1;
    }
  }

  restartGame(scene) {
    const state = store.getState();
    const { counter } = state;

    if (counter.lives !== 0) {
      store.dispatch(decrement());

      scene.pipes.clear(true, true);
      scene.gaps.clear(true, true);
      scene.flappyBird.destroy();
      scene.gameOver.visible = false;
      scene.scoreboard.visible = false;
      scene.restart.visible = false;
      scene.scoreTxt.setText("0");
      scene.initGame();
    }
  }

  async updateScore(_, gap) {
    if (!this.isGameOver) {
      this.soundPoint.play();
      this.score++;

      gap.destroy();

      if (this.score % 10 == 0) {
        this.backgroundDay.visible = !this.backgroundDay.visible;
        this.backgroundNight.visible = !this.backgroundNight.visible;
        if (this.currentPipe === assets.obstacle.pipe.green) {
          this.currentPipe = assets.obstacle.pipe.red;
        } else {
          this.currentPipe = assets.obstacle.pipe.green;
        }
      }
      this.scoreTxt.setText(this.score);
      roundScore++;
    }
  }

  async game_mid() {
    let data = JSON.stringify({
      tour_id: this.tour_id,
      toy_id: 1,
      point: this.score,
      check_str: check_str,
      back_str: "",
    });
    console.log("check_str: ", check_str);

    let config2 = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api-game.mongolnft.com/api/gamemid-web3/",
      headers: {
        Authorization: `JWT ${jwtToken}`,
        "Content-Type": "application/json",
      },
      data: data,
    };
    axios
      .request(config2)
      .then((response) => {
        mid_check_str = response.data.data.mid_check_str;
        mid_check_str_history.push(mid_check_str);
        console.log(mid_check_str_history.length);
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async onInit() {
    let data = "";
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://api-game.mongolnft.com/api/gamestart-web3/?tour_id=${this.tour_id}&toy_id=1`,
      headers: {
        Authorization: `JWT ${jwtToken}`,
      },
      data: data,
    };
    try {
      axios.request(config).then((response) => {
        let current_player =
          response?.data?.data?.game_start?.user?.username.toLowerCase();
        if (current_player == player) {
          check_str = response?.data?.data?.game_start?.check_str;
          user_id = response?.data?.data?.game_start?.user?.id;
          console.log(JSON.stringify(response?.data));
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  async startGame() {
    this.scoreTxt.alpha = 1;
    this.hasGameStarted = true;
    this.start.visible = false;
    this.makePipes();

    firstTry = true;
    await this.onInit();

    interval = setInterval(() => {
      this.game_mid();
    }, 10000);
  }

  makePipes() {
    if (!this.hasGameStarted) return;
    if (this.isGameOver) return;

    const val = 288;

    const top = Phaser.Math.Between(-120, 120);
    const gap = this.add.line(val, top + 210, 0, 0, 0, 98);
    this.gaps.add(gap);
    gap.body.allowGravity = false;
    gap.visible = false;

    const pipeTop = this.pipes
      .create(val, top, this.currentPipe.top)
      .setImmovable(true);
    pipeTop.body.allowGravity = false;

    const pipeBottom = this.pipes
      .create(val, top + 430, this.currentPipe.bottom)
      .setImmovable(true);
    pipeBottom.body.allowGravity = false;
  }
}

export default FlappyBirdScene;
