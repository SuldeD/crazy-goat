import { createContext, useContext, useEffect, useState } from "react";
import { defineValues } from "./counterSlice";
import { store } from "./store";

const UserContext = createContext();

export const UserWrapper = ({ children }) => {
  const [state, setState] = useState({
    data: null,
  });
  const value = { state, setState };

  useEffect(() => {
    if (state.data) {
      const { user, seasons } = state.data;

      if (user) {
        // store.dispatch(incrementByAmount(user.point));

        //user.game_life_qty
        store.dispatch(
          defineValues({
            score: user.point,
            lives: user.game_life_qty,
            burned: seasons.mnft_total_qty,
            mnft: user.mnft_balance,
          })
        );
      }
    }
  }, [state.data]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUserContext = () => useContext(UserContext);
