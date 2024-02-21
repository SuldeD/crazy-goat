/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect, useRef } from "react";
import { makeHash } from "../../services/helpers";
import Cookies from "universal-cookie";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogOverlay,
  HStack,
  Stack,
  Text,
  useDisclosure,
  useToast,
  Wrap,
} from "@chakra-ui/react";
import { AiFillHeart, AiFillStar } from "react-icons/ai";
import { IoGameController } from "react-icons/io5";
import { Field, Form, Formik } from "formik";
import MInput from "../../components/Input";
import MButton from "../../components/Button";
import { getTournamentContract } from "../../helper_contracts/TournamentContractHelper";
import { parse18 } from "../../helper_contracts/helpers";
import { buyLifeAPI } from "../../services/getService";
import * as Yup from "yup";

export default function NinjaGame({
  tour_id,
  total,
  life,
  data,
  updateTournomentDetailData,
}) {
  const cookies = new Cookies();
  const jwtToken = cookies.get("jwtToken");
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const [isDisabled, setIsDisabled] = useState(false);

  let player = "";
  let back_str = "";
  let user_id = "";
  let check_str = "";
  let mid_check_str_history = [];
  let mid_check_str = "";
  let intervalId;

  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const introRef = useRef(null);
  const perfectRef = useRef(null);
  const restartRef = useRef(null);
  const [oneTimeScore, setOneTimeScore] = useState(0);

  let phase = "waiting"; // waiting | stretching | turning | walking | transitioning | falling
  let lastTimestamp; // The timestamp of the previous requestAnimationFrame cycle

  let heroX; // Changes when moving forward
  let heroY; // Only changes when falling
  let sceneOffset; // Moves the whole game

  let platforms = [];
  let sticks = [];
  let trees = [];

  let score = 0;

  // Configuration
  const canvasWidth = 375;
  const canvasHeight = 375;
  const platformHeight = 100;
  const heroDistanceFromEdge = 10; // While waiting
  const paddingX = 100; // The waiting position of the hero in from the original canvas size
  const perfectAreaSize = 10;

  // The background moves slower than the hero
  const backgroundSpeedMultiplier = 0.2;

  const hill1BaseHeight = 100;
  const hill1Amplitude = 10;
  const hill1Stretch = 1;
  const hill2BaseHeight = 70;
  const hill2Amplitude = 20;
  const hill2Stretch = 0.5;

  const stretchingSpeed = 4; // Milliseconds it takes to draw a pixel
  const turningSpeed = 4; // Milliseconds it takes to turn a degree
  const walkingSpeed = 4;
  const transitioningSpeed = 2;
  const fallingSpeed = 2;

  const heroWidth = 17; // 24
  const heroHeight = 30; // 40

  useEffect(() => {
    player = window.ethereum.selectedAddress;
  }, [player]);

  useEffect(() => {
    let canvas = canvasRef.current;
    canvas.width = rootRef.current.clientWidth;
    canvas.height = rootRef.current.clientHeight;
    resetGame();
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", function (event) {
      if (event.key == " ") {
        event.preventDefault();
        resetGame();
        return;
      }
    });

    function handleStart() {
      if (phase == "waiting") {
        // if (phase == "waiting" && current_life > 0) {
        lastTimestamp = undefined;
        introRef.current.style.opacity = 0;
        phase = "stretching";
        window.requestAnimationFrame(animate);
      }
    }

    function handleEnd() {
      if (phase == "stretching") {
        phase = "turning";
      }
    }

    // Add event listeners for mouse events
    rootRef.current.addEventListener("mousedown", handleStart);
    rootRef.current.addEventListener("mouseup", handleEnd);

    // Add event listeners for touch events
    rootRef.current.addEventListener("touchstart", handleStart);
    rootRef.current.addEventListener("touchend", handleEnd);

    rootRef.current.addEventListener("resize", function () {
      if (canvasRef.current) {
        canvasRef.current.width = rootRef.current.clientWidth;
        canvasRef.current.height = rootRef.current.clientHeight;
        draw();
      }
    });
  }, []);

  Math.sinus = function (degree) {
    return Math.sin((degree / 180) * Math.PI);
  };

  function resetGame() {
    // Reset game progress
    phase = "waiting";
    lastTimestamp = undefined;
    sceneOffset = 0;
    score = 0;

    introRef.current.style.opacity = 1;
    perfectRef.current.style.opacity = 0;
    restartRef.current.style.display = "none";
    setOneTimeScore(score);

    // The first platform is always the same
    // x + w has to match paddingX
    platforms = [{ x: 50, w: 50 }];
    generatePlatform();
    generatePlatform();
    generatePlatform();
    generatePlatform();

    // console.log("platforms");
    // console.log(platforms);

    sticks = [{ x: platforms[0].x + platforms[0].w, length: 0, rotation: 0 }];

    trees = [];
    generateTree();
    generateTree();
    generateTree();
    generateTree();
    generateTree();
    generateTree();
    generateTree();
    generateTree();
    generateTree();
    generateTree();

    heroX = platforms[0].x + platforms[0].w - heroDistanceFromEdge;
    heroY = 0;

    draw();
  }

  function game_mid() {
    let data = JSON.stringify({
      tour_id: tour_id,
      toy_id: 3,
      point: score,
      check_str: check_str,
      back_str: "",
    });
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

  function startInterval() {
    intervalId = setInterval(game_mid, 10000); // call game_mid() every 10 seconds
  }

  function stopInterval() {
    clearInterval(intervalId);
  }

  // The main game loop
  async function animate(timestamp) {
    if (!lastTimestamp) {
      lastTimestamp = timestamp;
      window?.requestAnimationFrame(animate);
      if (!check_str) {
        startInterval();
        let data = "";
        let config = {
          method: "get",
          maxBodyLength: Infinity,
          url: `https://api-game.mongolnft.com/api/gamestart-web3/?tour_id=${tour_id}&toy_id=3`,
          headers: {
            Authorization: `JWT ${jwtToken}`,
          },
          data: data,
        };
        try {
          axios.request(config).then((response) => {
            let current_player =
              response?.data?.data.game_start?.user?.username.toLowerCase();

            if (current_player == player) {
              check_str = response?.data?.data?.game_start?.check_str;
              user_id = response?.data?.data?.game_start?.user?.id;
              console.log(JSON.stringify(response.data));
            } else {
              setIsDisabled(true);
              console.log(isDisabled);
            }
          });
        } catch (error) {
          console.log(error);
        }
      } else {
      }
      return;
    }
    switch (phase) {
      case "waiting":
        return; // Stop the loop
      case "stretching": {
        sticks[sticks.length - 1].length +=
          (timestamp - lastTimestamp) / stretchingSpeed;
        break;
      }
      case "turning": {
        sticks[sticks.length - 1].rotation +=
          (timestamp - lastTimestamp) / turningSpeed;

        if (sticks[sticks.length - 1].rotation > 90) {
          sticks[sticks.length - 1].rotation = 90;

          const [nextPlatform, perfectHit] = thePlatformTheStickHits();
          if (nextPlatform) {
            // Increase score
            score += perfectHit ? 2 : 1;
            setOneTimeScore(score);

            if (perfectHit) {
              perfectRef.current.style.opacity = 1;
              setTimeout(() => (perfectRef.current.style.opacity = 0), 1000);
            }
            generatePlatform();
            generateTree();
            generateTree();
          }
          phase = "walking";
        }
        break;
      }
      case "walking": {
        heroX += (timestamp - lastTimestamp) / walkingSpeed;
        const [nextPlatform] = thePlatformTheStickHits();
        if (nextPlatform) {
          // If hero will reach another platform then limit it's position at it's edge
          const maxHeroX =
            nextPlatform.x + nextPlatform.w - heroDistanceFromEdge;
          if (heroX > maxHeroX) {
            heroX = maxHeroX;
            phase = "transitioning";
          }
        } else {
          // If hero won't reach another platform then limit it's position at the end of the pole
          const maxHeroX =
            sticks[sticks.length - 1].x +
            sticks[sticks.length - 1].length +
            heroWidth;
          if (heroX > maxHeroX) {
            heroX = maxHeroX;
            phase = "falling";
          }
        }
        break;
      }
      case "transitioning": {
        sceneOffset += (timestamp - lastTimestamp) / transitioningSpeed;
        const [nextPlatform] = thePlatformTheStickHits();
        if (sceneOffset > nextPlatform.x + nextPlatform.w - paddingX) {
          // Add the next step
          sticks.push({
            x: nextPlatform.x + nextPlatform.w,
            length: 0,
            rotation: 0,
          });
          phase = "waiting";
        }
        break;
      }
      case "falling": {
        const rotationIncrement = (timestamp - lastTimestamp) / turningSpeed;
        const maxHeroY =
          platformHeight +
          100 +
          (rootRef.current.clientHeight - canvasHeight) / 2;

        if (sticks[sticks.length - 1].rotation < 180) {
          sticks[sticks.length - 1].rotation += rotationIncrement;
        }

        heroY += (timestamp - lastTimestamp) / fallingSpeed;

        if (heroY > maxHeroY) {
          stopInterval();
          try {
            const makeHashParams = [
              user_id.toString(),
              score.toString(),
              check_str,
              ...mid_check_str_history.map((item) => item.toString()),
            ];
            back_str = await makeHash(makeHashParams, score);
            console.log("back_str: ", back_str);

            let data = JSON.stringify({
              tour_id: tour_id,
              toy_id: 3,
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

              JSON.stringify(response.data.return_code) == "2002" &&
                updateTournomentDetailData();
            });
          } catch (error) {
            console.log(error);
          }
          restartRef.current.style.display = "block";
          return;
        }
        break;
      }
      default:
        throw Error("Wrong phase");
    }
    draw();
    window.requestAnimationFrame(animate);
    lastTimestamp = timestamp;
  }
  // Returns the platform the stick hit (if it didn't hit any stick then return undefined)
  function thePlatformTheStickHits() {
    if (sticks[sticks.length - 1].rotation != 90)
      throw Error(`Stick is ${sticks[sticks.length - 1].rotation}°`);
    const stickFarX =
      sticks[sticks.length - 1].x + sticks[sticks.length - 1].length;

    const platformTheStickHits = platforms.find(
      (platform) =>
        platform.x < stickFarX && stickFarX < platform.x + platform.w
    );

    // If the stick hits the perfect area
    if (
      platformTheStickHits &&
      platformTheStickHits.x +
        platformTheStickHits.w / 2 -
        perfectAreaSize / 2 <
        stickFarX &&
      stickFarX <
        platformTheStickHits.x +
          platformTheStickHits.w / 2 +
          perfectAreaSize / 2
    )
      return [platformTheStickHits, true];

    return [platformTheStickHits, false];
  }

  function generatePlatform() {
    const minimumGap = 40;
    const maximumGap = 200;
    const minimumWidth = 20;
    const maximumWidth = 100;

    // X coordinate of the right edge of the furthest platform
    const lastPlatform = platforms[platforms.length - 1];
    let furthestX = lastPlatform.x + lastPlatform.w;

    const x =
      furthestX +
      minimumGap +
      Math.floor(Math.random() * (maximumGap - minimumGap));
    const w =
      minimumWidth + Math.floor(Math.random() * (maximumWidth - minimumWidth));

    platforms.push({ x, w });
  }

  function generateTree() {
    const minimumGap = 30;
    const maximumGap = 150;

    // X coordinate of the right edge of the furthest tree
    const lastTree = trees[trees.length - 1];
    let furthestX = lastTree ? lastTree.x : 0;

    const x =
      furthestX +
      minimumGap +
      Math.floor(Math.random() * (maximumGap - minimumGap));

    const treeColors = ["#6D8821", "#8FAC34", "#98B333"];
    const color = treeColors[Math.floor(Math.random() * 3)];

    trees.push({ x, color });
  }

  function draw() {
    canvasRef.current.getContext("2d").save();
    canvasRef.current
      .getContext("2d")
      .clearRect(
        0,
        0,
        rootRef.current.clientWidth,
        rootRef.current.clientHeight
      );

    drawBackground();

    // Center main canvas area to the middle of the screen
    canvasRef.current
      .getContext("2d")
      .translate(
        (rootRef.current.clientWidth - canvasWidth) / 2 - sceneOffset,
        (rootRef.current.clientHeight - canvasHeight) / 2
      );

    // Draw scene
    drawPlatforms();
    drawHero();
    drawSticks();

    // Restore transformation
    canvasRef.current.getContext("2d").restore();
  }

  function drawSticks() {
    sticks.forEach((stick) => {
      canvasRef.current.getContext("2d").save();

      // Move the anchor point to the start of the stick and rotate
      canvasRef.current
        .getContext("2d")
        .translate(stick.x, canvasHeight - platformHeight);
      canvasRef.current
        .getContext("2d")
        .rotate((Math.PI / 180) * stick.rotation);

      // Draw stick
      canvasRef.current.getContext("2d").beginPath();
      canvasRef.current.getContext("2d").lineWidth = 2;
      canvasRef.current.getContext("2d").moveTo(0, 0);
      canvasRef.current.getContext("2d").lineTo(0, -stick.length);
      canvasRef.current.getContext("2d").stroke();

      // Restore transformations
      canvasRef.current.getContext("2d").restore();
    });
  }

  function drawHero() {
    canvasRef.current.getContext("2d").save();
    canvasRef.current.getContext("2d").fillStyle = "black";
    canvasRef.current
      .getContext("2d")
      .translate(
        heroX - heroWidth / 2,
        heroY + canvasHeight - platformHeight - heroHeight / 2
      );

    // Body
    drawRoundedRect(
      -heroWidth / 2,
      -heroHeight / 2,
      heroWidth,
      heroHeight - 4,
      5
    );

    // Legs
    const legDistance = 5;
    canvasRef.current.getContext("2d").beginPath();
    canvasRef.current
      .getContext("2d")
      .arc(legDistance, 11.5, 3, 0, Math.PI * 2, false);
    canvasRef.current.getContext("2d").fill();
    canvasRef.current.getContext("2d").beginPath();
    canvasRef.current
      .getContext("2d")
      .arc(-legDistance, 11.5, 3, 0, Math.PI * 2, false);
    canvasRef.current.getContext("2d").fill();

    // Eye
    canvasRef.current.getContext("2d").beginPath();
    canvasRef.current.getContext("2d").fillStyle = "white";
    canvasRef.current.getContext("2d").arc(5, -7, 3, 0, Math.PI * 2, false);
    canvasRef.current.getContext("2d").fill();

    // Band
    canvasRef.current.getContext("2d").fillStyle = "red";
    canvasRef.current
      .getContext("2d")
      .fillRect(-heroWidth / 2 - 1, -12, heroWidth + 2, 4.5);
    canvasRef.current.getContext("2d").beginPath();
    canvasRef.current.getContext("2d").moveTo(-9, -14.5);
    canvasRef.current.getContext("2d").lineTo(-17, -18.5);
    canvasRef.current.getContext("2d").lineTo(-14, -8.5);
    canvasRef.current.getContext("2d").fill();
    canvasRef.current.getContext("2d").beginPath();
    canvasRef.current.getContext("2d").moveTo(-10, -10.5);
    canvasRef.current.getContext("2d").lineTo(-15, -3.5);
    canvasRef.current.getContext("2d").lineTo(-5, -7);
    canvasRef.current.getContext("2d").fill();

    canvasRef.current.getContext("2d").restore();
  }

  function drawRoundedRect(x, y, width, height, radius) {
    canvasRef.current.getContext("2d").beginPath();
    canvasRef.current.getContext("2d").moveTo(x, y + radius);
    canvasRef.current.getContext("2d").lineTo(x, y + height - radius);
    canvasRef.current
      .getContext("2d")
      .arcTo(x, y + height, x + radius, y + height, radius);
    canvasRef.current.getContext("2d").lineTo(x + width - radius, y + height);
    canvasRef.current
      .getContext("2d")
      .arcTo(x + width, y + height, x + width, y + height - radius, radius);
    canvasRef.current.getContext("2d").lineTo(x + width, y + radius);
    canvasRef.current
      .getContext("2d")
      .arcTo(x + width, y, x + width - radius, y, radius);
    canvasRef.current.getContext("2d").lineTo(x + radius, y);
    canvasRef.current.getContext("2d").arcTo(x, y, x, y + radius, radius);
    canvasRef.current.getContext("2d").fill();
  }

  function drawPlatforms() {
    platforms.forEach(({ x, w }) => {
      // Draw platform
      canvasRef.current.getContext("2d").fillStyle = "black";
      canvasRef.current
        .getContext("2d")
        .fillRect(
          x,
          canvasHeight - platformHeight,
          w,
          platformHeight + (rootRef.current.clientHeight - canvasHeight) / 2
        );

      // Draw perfect area only if hero did not yet reach the platform
      if (sticks[sticks.length - 1].x < x) {
        canvasRef.current.getContext("2d").fillStyle = "red";
        canvasRef.current
          .getContext("2d")
          .fillRect(
            x + w / 2 - perfectAreaSize / 2,
            canvasHeight - platformHeight,
            perfectAreaSize,
            perfectAreaSize
          );
      }
    });
  }

  function drawBackground() {
    // Draw sky
    var gradient = canvasRef.current
      .getContext("2d")
      .createLinearGradient(0, 0, 0, rootRef.current.clientHeight);
    gradient.addColorStop(0, "#BBD691");
    gradient.addColorStop(1, "#FEF1E1");
    canvasRef.current.getContext("2d").fillStyle = gradient;
    canvasRef.current
      .getContext("2d")
      .fillRect(
        0,
        0,
        rootRef.current.clientWidth,
        rootRef.current.clientHeight
      );

    // Draw hills
    drawHill(hill1BaseHeight, hill1Amplitude, hill1Stretch, "#95C629");
    drawHill(hill2BaseHeight, hill2Amplitude, hill2Stretch, "#659F1C");

    // // Draw trees
    trees.forEach((tree) => drawTree(tree.x, tree.color));
  }

  function drawHill(baseHeight, amplitude, stretch, color) {
    canvasRef.current.getContext("2d").beginPath();
    canvasRef.current.getContext("2d").moveTo(0, rootRef.current.clientHeight);
    canvasRef.current
      .getContext("2d")
      .lineTo(0, getHillY(0, baseHeight, amplitude, stretch));
    for (let i = 0; i < rootRef.current.clientWidth; i++) {
      canvasRef.current
        .getContext("2d")
        .lineTo(i, getHillY(i, baseHeight, amplitude, stretch));
    }
    canvasRef.current
      .getContext("2d")
      .lineTo(rootRef.current.clientWidth, rootRef.current.clientHeight);
    canvasRef.current.getContext("2d").fillStyle = color;
    canvasRef.current.getContext("2d").fill();
  }

  function drawTree(x, color) {
    canvasRef.current.getContext("2d").save();
    canvasRef.current
      .getContext("2d")
      .translate(
        (-sceneOffset * backgroundSpeedMultiplier + x) * hill1Stretch,
        getTreeY(x, hill1BaseHeight, hill1Amplitude)
      );

    const treeTrunkHeight = 5;
    const treeTrunkWidth = 2;
    const treeCrownHeight = 25;
    const treeCrownWidth = 10;

    // Draw trunk
    canvasRef.current.getContext("2d").fillStyle = "#7D833C";
    canvasRef.current
      .getContext("2d")
      .fillRect(
        -treeTrunkWidth / 2,
        -treeTrunkHeight,
        treeTrunkWidth,
        treeTrunkHeight
      );

    // Draw crown
    canvasRef.current.getContext("2d").beginPath();
    canvasRef.current
      .getContext("2d")
      .moveTo(-treeCrownWidth / 2, -treeTrunkHeight);
    canvasRef.current
      .getContext("2d")
      .lineTo(0, -(treeTrunkHeight + treeCrownHeight));
    canvasRef.current
      .getContext("2d")
      .lineTo(treeCrownWidth / 2, -treeTrunkHeight);
    canvasRef.current.getContext("2d").fillStyle = color;
    canvasRef.current.getContext("2d").fill();

    canvasRef.current.getContext("2d").restore();
  }

  const restartGame = (event) => {
    event.preventDefault();
    resetGame();
    restartRef.current.style.display = "none";

    updateTournomentDetailData();
  };

  const handleBuyLife = async (values) => {
    try {
      const { count } = values;
      let { tournamentWriteContract } = await getTournamentContract(
        data.address
      );
      let price = parse18(parseFloat(count / 100));
      const tx = await tournamentWriteContract.deposit({
        value: price,
      });
      await tx.wait();

      let info = JSON.stringify({
        transaction_hash: tx.hash,
        chain: "mumbai",
        tournoment_id: data.id,
      });
      const res = await buyLifeAPI(info);
      onClose();
      toast({
        title: "Success",
        description: `Success`,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      updateTournomentDetailData();
      return res;
    } catch (error) {
      console.log(error);
      toast({
        title: "Not buy life.",
        description: `${err.reason}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return null;
    }
  };

  const lifeSchema = Yup.object().shape({
    count: Yup.string().required("Required"),
  });

  useEffect(() => {
    life == 0 && onOpen();
  }, [life, onOpen]);

  useEffect(() => {
    isDisabled && onOpen();
  }, [isDisabled, onOpen]);

  return (
    <div className="w-full">
      <AlertDialog motionPreset="slideInBottom" isOpen={isOpen} isCentered>
        <AlertDialogOverlay />
        <AlertDialogContent bg="black" rounded="20px" p="5">
          <AlertDialogHeader textColor="white">Buy life</AlertDialogHeader>
          <AlertDialogBody>
            <Text mb="3" fontFamily="primary" fontSize="16px" color="white">
              description
            </Text>
            <Formik
              validationSchema={lifeSchema}
              initialValues={{ count: "" }}
              onSubmit={async (values) => {
                await handleBuyLife(values);
                actions.setSubmitting(false);
              }}
            >
              {(props) => (
                <Form>
                  <Stack w="full" gap="2">
                    <Field name="count">
                      {({ field, form }) => (
                        <>
                          <MInput
                            id="life"
                            mt="1"
                            min={1}
                            {...field}
                            placeholder="Life count"
                            type="number"
                          />
                          <Text color="rgba(255,145,0,.831)" mt="1">
                            {form.touched.count && form.errors.count}
                          </Text>
                        </>
                      )}
                    </Field>

                    <MButton
                      w="full"
                      type="submit"
                      text="Buy Life"
                      isLoading={props.isSubmitting}
                    />
                  </Stack>
                </Form>
              )}
            </Formik>

            <MButton
              mt="4"
              w="full"
              text="Exit"
              onClick={() => router.back()}
            />
          </AlertDialogBody>
        </AlertDialogContent>
      </AlertDialog>
      <div className="h-screen pb-10 text-white font-body">
        <Wrap justify="space-between" wrap={true}>
          <Stack
            borderRadius="20px"
            bg="whiteAlpha.100"
            px="5"
            justify="center"
            minH="100px"
            w={["100%", "32%", "30%"]}
          >
            <HStack mb="1">
              <Text fontFamily="primary" fontSize="20px" textColor="white">
                Total Score
              </Text>
              <Text fontFamily="primary" fontSize="18px" textColor="white">
                <AiFillStar />
              </Text>
            </HStack>
            <Text
              fontFamily="primary"
              fontSize="32px"
              fontWeight="500"
              textColor="yellow.primary"
            >
              {total}
            </Text>
          </Stack>
          <Stack
            borderRadius="20px"
            bg="whiteAlpha.100"
            px="5"
            justify="center"
            minH="100px"
            w={["100%", "32%", "30%"]}
          >
            <HStack mb="1">
              <Text fontFamily="primary" fontSize="20px" textColor="white">
                Life
              </Text>
              <Text fontFamily="primary" fontSize="18px" textColor="white">
                <AiFillHeart />
              </Text>
            </HStack>
            <Text
              fontFamily="primary"
              fontSize="32px"
              fontWeight="500"
              textColor="yellow.primary"
            >
              {life}
            </Text>
          </Stack>
          <Stack
            borderRadius="20px"
            bg="whiteAlpha.100"
            px="5"
            justify="center"
            minH="100px"
            w={["100%", "32%", "30%"]}
          >
            <HStack mb="1">
              <Text fontFamily="primary" fontSize="20px" textColor="white">
                Score
              </Text>
              <Text fontFamily="primary" fontSize="18px" textColor="white">
                <IoGameController />
              </Text>
            </HStack>
            <Text
              fontFamily="primary"
              fontSize="32px"
              fontWeight="500"
              textColor="yellow.primary"
            >
              {oneTimeScore}
            </Text>
          </Stack>
        </Wrap>
        <div
          ref={rootRef}
          className="mt-10 cursor-pointer flex flex-col justify-center items-center w-full h-3/4 font-body"
        >
          <canvas ref={canvasRef} width="300" height="300" />
          <div
            ref={introRef}
            disabled={isDisabled}
            className={`w-[200px] h-[150px] absolute font-semibold text-lg text-center text-black select-none`}
          >
            Hold down the mouse to stretch out a stick
          </div>
          <div ref={perfectRef} className={`absolute opacity-0`}>
            DOUBLE SCORE
          </div>
          <button
            onClick={restartGame}
            // disabled={isDisabled}
            ref={restartRef}
            className={`absolute border-none w-[120px] h-[120px] hidden rounded-full text-white bg-[#02E111] font-semibold text-xl cursor-pointer`}
          >
            RESTART
          </button>
        </div>
      </div>
    </div>
  );

  function getHillY(windowX, baseHeight, amplitude, stretch) {
    const sineBaseY = rootRef.current.clientHeight - baseHeight;
    return (
      Math.sinus(
        (sceneOffset * backgroundSpeedMultiplier + windowX) * stretch
      ) *
        amplitude +
      sineBaseY
    );
  }

  function getTreeY(x, baseHeight, amplitude) {
    const sineBaseY = rootRef.current.clientHeight - baseHeight;
    return Math.sinus(x) * amplitude + sineBaseY;
  }
}
