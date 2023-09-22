import { Input } from "@chakra-ui/react";

export const MInput = ({ text, ...props }) => (
  <Input textColor="white" rounded="35px" border="1px" {...props} />
);

export default MInput;
