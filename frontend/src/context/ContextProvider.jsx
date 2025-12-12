import { createContext, useState, useContext } from "react";

// Create Context
const NavContext = createContext();

 const ContextProvider = ({ children }) => {
  const [activeNav, setActiveNav] = useState("home"); // default active

  return (
    <NavContext.Provider value={{ activeNav, setActiveNav }}>
      {children}
    </NavContext.Provider>
  );
};
export default ContextProvider
// Custom Hook (easy use everywhere)
export const useNav = () => useContext(NavContext);
