"use client";

import Preload from "@/components/preload";
import { createContext, useState, useEffect, useContext } from "react";
import { createPortal } from "react-dom";

const PreloadContext = createContext({
  preload: true,
  setPreload: (preload) => {},
});

export default function PreloadProvider({ children }) {
  const [preload, setPreload] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  });

  if (!isMounted) return null;

  return (
    <PreloadContext.Provider value={{ preload, setPreload }}>
      {preload &&
        isMounted &&
        createPortal(<Preload setPreload={setPreload} />, document.body)}
      {children}
    </PreloadContext.Provider>
  );
}

export const usePreload = () => {
  const context = useContext(PreloadContext);
  if (context === undefined) {
    throw new Error("usePreload must be used within a PreloadProvider");
  }

  return context;
};
