import { Center, Spinner, Text, VStack } from "@chakra-ui/react";
import { useEffect } from "react";
import FlappyBirdScene from "./FlappyBirdScene";

export const Game = ({ isLoading }) => {
  useEffect(() => {
    const widthGlobal = window.screen.width;

    const configMobile = {
      type: Phaser.AUTO,
      parent: "idGamePlay",
      physics: {
        default: "arcade",
        arcade: {
          gravity: {
            y: 600,
          },
          debug: false,
        },
      },
      scale: {
        mode: Phaser.Scale.FIT,
        width: 288,
        height: 512,
      },
      scene: [FlappyBirdScene],
    };

    const configBrowser = {
      type: Phaser.AUTO,
      // parent: "idGamePlay",
      physics: {
        default: "arcade",
        arcade: {
          gravity: {
            y: 600,
          },
          debug: false,
        },
      },
      scale: {
        mode: Phaser.Scale.FIT,
        width: 288,
        height: 512,
      },
      scene: [FlappyBirdScene],
    };

    new Phaser.Game(widthGlobal < 768 ? configMobile : configBrowser);

    const container = document.querySelector(".idGamePlay");
    const canvas = document.querySelector("canvas");
    // canvas.style.maxWidth = "100vw"
    // canvas.style.maxHeight = "100%"
    container.append(canvas);

    window.scrollTo(0, 0);
  }, []);

  return (
    <Center className="idGamePlay" pos="relative">
      {isLoading && (
        <Center
          pos="absolute"
          left="0"
          top="0"
          w="100%"
          h="100%"
          bg="rgba(0,0,0,0.3)"
        >
          <VStack color="white">
            <Spinner />
            <Text>Уншиж байна...</Text>
          </VStack>
        </Center>
      )}
    </Center>
  );
};
