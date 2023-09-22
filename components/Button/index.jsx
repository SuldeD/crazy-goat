"use client";

import { Button, Spinner } from "@chakra-ui/react";
import "./button.css";

export const MButton = ({ text, isLoading, ...props }) => (
  <>
    {isLoading ? (
      <Button borderRadius="35px" border="1px" isLoading {...props}>
        <Spinner />
      </Button>
    ) : (
      <Button
        className="active-button"
        borderRadius="35px"
        border="1px"
        {...props}
      >
        {text}
      </Button>
    )}
  </>
);

export default MButton;
