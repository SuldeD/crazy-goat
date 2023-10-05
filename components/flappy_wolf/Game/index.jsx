import { Center, Spinner, Text, VStack } from "@chakra-ui/react";
import { useEffect } from "react";
import FlappyBirdScene from "./FlappyBirdScene";

export const Game = ({
  isLoading,
  tour_id,
  updateTournomentDetailData,
  life,
  onOpen,
}) => {
  useEffect(() => {
    life == 0 && onOpen();
  }, [life, onOpen]);

  useEffect(() => {
    const widthGlobal = window.screen.width;
    const flappyBirdSceneInstance = new FlappyBirdScene(
      tour_id,
      life,
      updateTournomentDetailData
    );

    const commonConfig = {
      type: Phaser.AUTO,
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
      scene: [flappyBirdSceneInstance],
    };

    const configMobile = {
      ...commonConfig,
      parent: "idGamePlay",
    };

    const configBrowser = {
      ...commonConfig,
    };

    new Phaser.Game(widthGlobal < 768 ? configMobile : configBrowser);

    const container = document.querySelector(".idGamePlay");
    const canvas = document.querySelector("canvas");
    container.append(canvas);

    window.scrollTo(0, 0);
  }, [tour_id, life, updateTournomentDetailData]);

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
