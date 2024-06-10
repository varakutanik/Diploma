import { createContext } from "react";

const Context = createContext({
  isUserAuth: false,
  userAuth: () => {},
  setErrMessage: () => {},
  errText: "",
});

export default Context;
