"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Cursor = () => {
  useGSAP(() => {
    function updateCursor(e) {
      gsap.to(".cursor", {
        // duration: 1,
        top: e.pageY + "px",
        left: e.pageX + "px",
        ease: "power3.out",
        delay: 0.01,
      });
    }

    document.addEventListener("mousemove", updateCursor);

    return () => {
      document.removeEventListener("mousemove", updateCursor);
    };
  }, []);
  return <div className="cursor">Explore</div>;
};

export default Cursor;
