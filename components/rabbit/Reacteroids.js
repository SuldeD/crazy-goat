/* eslint-disable no-unused-vars */
import React, { Component } from "react";
import Ship from "./Ship";
import Asteroid from "./Asteroid";
import { randomNumBetweenExcluding } from "./helpers";
import MButton from "../../components/Button";
import axios from "axios";
import { makeHash } from "../flappy_wolf/utils/helpers";

const KEY = {
  LEFT: 37,
  RIGHT: 39,
  UP: 38,
  A: 65,
  D: 68,
  W: 87,
  SPACE: 13,
};

let interval = null;
let player = "";
let user_id = "";
let check_str = "";
let mid_check_str_history = [];
let mid_check_str = "";
let id = 0;

export class Reacteroids extends Component {
  constructor() {
    super();
    this.state = {
      screen: {
        width: 0,
        height: 0,
        ratio: 1,
      },
      context: null,
      keys: {
        left: 0,
        right: 0,
        up: 0,
        down: 0,
        space: 0,
      },
      asteroidCount: 3,
      currentScore: 0,
      inGame: false,
      showPlayButton: true,
      // topScore: localStorage["topscore"] || 0,
    };
    this.ship = [];
    this.asteroids = [];
    this.bullets = [];
    this.particles = [];
  }

  handleResize() {
    this.setState({
      screen: {
        width: window.innerWidth,
        height: window.innerHeight,
        ratio: window.devicePixelRatio || 1,
      },
    });
  }

  handleKeys(value, e) {
    let keys = this.state.keys;
    if (e.keyCode === KEY.LEFT || e.keyCode === KEY.A) keys.left = value;
    if (e.keyCode === KEY.RIGHT || e.keyCode === KEY.D) keys.right = value;
    if (e.keyCode === KEY.UP || e.keyCode === KEY.W) keys.up = value;
    if (e.keyCode === KEY.SPACE) keys.space = value; // Corrected from KEY.RETURN to KEY.SPACE
    this.setState({
      keys: keys,
    });
  }

  async componentDidMount() {
    const { tour_id, updateTournomentDetailData, jwtToken } = this.props;
    this.id = tour_id;
    this.updateTournomentDetailData = updateTournomentDetailData;
    this.jwtToken = jwtToken?.value;

    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          player = accounts[0];
        } else {
          console.error("No Ethereum accounts available.");
        }
      } else {
        console.error("MetaMask is not installed or not enabled!");
      }
    } catch (error) {
      console.error("Error connecting to Ethereum wallet:", error);
    }

    this.handleResize(); // Initial size calculation

    window.addEventListener("keyup", this.handleKeys.bind(this, false));
    window.addEventListener("keydown", this.handleKeys.bind(this, true));
    window.addEventListener("resize", this.handleResize.bind(this));

    this.setState({
      showPlayButton: true,
    });

    const context = this.canvasRef.getContext("2d");
    this.setState({ context: context });

    if (!this.state.showPlayButton) {
      this.startGame();

      requestAnimationFrame(() => {
        this.update();
      });
    }
  }

  handleResize() {
    this.setState({
      screen: {
        width: window.innerWidth,
        height: window.innerHeight,
        ratio: window.devicePixelRatio || 1,
      },
    });
  }

  componentWillUnmount() {
    window.removeEventListener("keyup", this.handleKeys);
    window.removeEventListener("keydown", this.handleKeys);
    window.removeEventListener("resize", this.handleResize);
  }

  update() {
    const context = this.state.context;

    context.save();
    context.scale(this.state.screen.ratio, this.state.screen.ratio);

    // Motion trail
    context.fillStyle = "#000";
    context.globalAlpha = 0.4;
    context.fillRect(0, 0, this.state.screen.width, this.state.screen.height);
    context.globalAlpha = 1;

    // Next set of asteroids
    if (!this.asteroids.length) {
      let count = this.state.asteroidCount + 1;
      this.setState({ asteroidCount: count });
      this.generateAsteroids(count);
    }

    // Check for colisions
    this.checkCollisionsWith(this.bullets, this.asteroids);
    this.checkCollisionsWith(this.ship, this.asteroids);

    // Remove or render
    this.updateObjects(this.particles, "particles");
    this.updateObjects(this.asteroids, "asteroids");
    this.updateObjects(this.bullets, "bullets");
    this.updateObjects(this.ship, "ship");

    context.restore();

    // Next frame
    requestAnimationFrame(() => {
      this.update();
    });
  }

  addScore(points) {
    if (this.state.inGame) {
      this.setState({
        currentScore: this.state.currentScore + points,
      });
    }
  }

  async onInit() {
    let data = "";
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://api-game.mongolnft.com/api/gamestart-web3/?tour_id=${this.id}&toy_id=4`,
      headers: {
        Authorization: `JWT ${this.jwtToken}`,
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
    this.setState({
      inGame: true,
      currentScore: 0,
      showPlayButton: false,
    });

    // Make ship
    let ship = new Ship({
      position: {
        x: this.state.screen.width / 2,
        y: this.state.screen.height / 2,
      },
      create: this.createObject.bind(this),
      onDie: this.gameOver.bind(this),
    });

    this.createObject(ship, "ship");

    // Make asteroids
    this.asteroids = [];
    this.generateAsteroids(this.state.asteroidCount);

    await this.onInit();

    // Check if the canvas is ready before starting the game
    if (this.state.context) {
      interval = setInterval(() => {
        this.game_mid();
      }, 10000);

      // Start the game loop
      requestAnimationFrame(() => {
        this.update();
      });
    } else {
      console.error("Canvas context not ready.");
    }
  }

  async game_mid() {
    let data = JSON.stringify({
      tour_id: this.id,
      toy_id: 4,
      point: Math.floor(Number(this.state.currentScore / 10)),
      check_str: check_str,
      back_str: "",
    });
    console.log("check_str: ", check_str);
    console.log(
      "this.state.currentScore: ",
      Math.floor(Number(this.state.currentScore))
    );
    console.log("jwtToken: ", this.jwtToken);

    let config2 = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api-game.mongolnft.com/api/gamemid-web3/",
      headers: {
        Authorization: `JWT ${this.jwtToken}`,
        "Content-Type": "application/json",
      },
      data: data,
    };
    axios
      .request(config2)
      .then((response) => {
        mid_check_str = response?.data?.data?.mid_check_str;
        mid_check_str_history.push(mid_check_str);
        console.log(mid_check_str_history.length);
        console.log(JSON.stringify(response?.data));
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async onFinishGame(score) {
    clearInterval(interval);
    try {
      const makeHashParams = [
        user_id.toString(),
        score.toString(),
        check_str,
        ...mid_check_str_history.map((item) => item),
      ];
      let back_str = await makeHash(makeHashParams, score);
      console.log("life: ", this.life);

      let data = JSON.stringify({
        tour_id: this.id,
        toy_id: 4,
        point: score,
        check_str: check_str,
        back_str: back_str,
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://api-game.mongolnft.com/api/gameend-web3/",
        headers: {
          Authorization: `JWT ${this.jwtToken}`,
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios.request(config).then((response) => {
        console.log(JSON.stringify(response.data));
      });
      mid_check_str_history = [];
      back_str = "";
    } catch (error) {
      console.log(error);
    }
    // clearInterval(interval);
    interval = null;
  }

  gameOver() {
    this.setState({
      inGame: false,
      showPlayButton: true,
    });

    this.updateTournomentDetailData();

    this.onFinishGame(Math.floor(Number(this.state.currentScore / 10)));

    // if (this.state.currentScore > this.state.topScore) {
    //   this.setState({
    //     topScore: this.state.currentScore,
    //   });
    //   localStorage["topscore"] = this.state.currentScore;
    // }
  }

  generateAsteroids(howMany) {
    let ship = this.ship[0];
    for (let i = 0; i < howMany; i++) {
      let asteroid = new Asteroid({
        size: 80,
        position: {
          x: randomNumBetweenExcluding(
            0,
            this.state.screen.width,
            ship.position.x - 60,
            ship.position.x + 60
          ),
          y: randomNumBetweenExcluding(
            0,
            this.state.screen.height,
            ship.position.y - 60,
            ship.position.y + 60
          ),
        },
        create: this.createObject.bind(this),
        addScore: this.addScore.bind(this),
      });
      this.createObject(asteroid, "asteroids");
    }
  }

  createObject(item, group) {
    this[group].push(item);
  }

  updateObjects(items, group) {
    let index = 0;
    for (let item of items) {
      if (item.delete) {
        this[group].splice(index, 1);
      } else {
        items[index].render(this.state);
      }
      index++;
    }
  }

  checkCollisionsWith(items1, items2) {
    var a = items1.length - 1;
    var b;
    for (a; a > -1; --a) {
      b = items2.length - 1;
      for (b; b > -1; --b) {
        var item1 = items1[a];
        var item2 = items2[b];
        if (this.checkCollision(item1, item2)) {
          item1.destroy();
          item2.destroy();
        }
      }
    }
  }

  checkCollision(obj1, obj2) {
    var vx = obj1.position.x - obj2.position.x;
    var vy = obj1.position.y - obj2.position.y;
    var length = Math.sqrt(vx * vx + vy * vy);
    if (length < obj1.radius + obj2.radius) {
      return true;
    }
    return false;
  }

  render() {
    let endgame;
    let message;

    if (this.state.currentScore <= 0) {
      message = `Your ${Math.floor(
        Number(this.state.currentScore / 10)
      )} points... crazy man.`;
    } else if (this.state.currentScore >= this.state.topScore) {
      message =
        "Top score with " +
        Math.floor(Number(this.state.currentScore / 10)) +
        " points. Woo!";
    } else {
      message =
        Math.floor(Number(this.state.currentScore / 10)) + " Points though :)";
    }

    if (!this.state.inGame) {
      endgame = (
        <div className="endgame">
          {this.state.currentScore > 1 ? (
            <p className="font-bold">{message}</p>
          ) : (
            <p className="font-bold">Let&apos;s go man!</p>
          )}

          {this.state.showPlayButton && (
            <MButton
              onClick={this.startGame.bind(this)}
              text="Play"
              className="mt-2"
              w="100%"
            />
          )}
        </div>
      );
    }

    return (
      <div className="text-white border">
        {endgame}
        {this.state.inGame && (
          <span className="score current-score">
            Score: {this.state.currentScore}
          </span>
        )}
        {this.state.inGame && (
          <span className="score top-score">
            Top Score: {this.state.topScore / 4}
          </span>
        )}
        {this.state.inGame && (
          <span className="controls">
            Use [A][S][W][D] or [←][↑][↓][→] to MOVE
            <br />
            Use [RETURN] to SHOOT
          </span>
        )}
        <div className="">
          <canvas
            ref={(canvas) => {
              this.canvasRef = canvas;
            }}
            className="canvas"
            width={this.state.screen.width * this.state.screen.ratio}
            height={this.state.screen.height * this.state.screen.ratio}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>
    );
  }
}
