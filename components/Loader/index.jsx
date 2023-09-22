import { Spinner } from "@chakra-ui/react";

export const Loader = () => {
  return (
    <div className="loader-container w-screen h-[60vh] flex justify-center items-center">
      <Spinner color="green.primary" size="lg" />
    </div>
  );
};

export default Loader;
