import { Button, Spinner } from "@chakra-ui/react";
import "./button.css";

export const MButton = ({ text, isLoading, ...props }) => (
  <>
    {isLoading ? (
      <Button borderRadius="35px" border="1px" px="5" isLoading {...props}>
        <Spinner />
      </Button>
    ) : (
      <Button
        // className="active-button"
        _hover={{ borderColor: "green.primary" }}
        borderRadius="35px"
        border="1px"
        px="30px"
        {...props}
      >
        {text}
      </Button>
    )}
  </>
);

export default MButton;
