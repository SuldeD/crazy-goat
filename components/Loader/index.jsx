import { Spinner } from "@chakra-ui/react";

export const Loader = () => {
  return (
    <div className="loader-container h-[120px] w-full flex justify-center items-center">
      <Spinner color="green.primary" size="lg" />
    </div>
  );
};

export default Loader;
