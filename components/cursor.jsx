"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Cursor = ({ text }) => {
  useGSAP(() => {
    function updateCursor(e) {
      gsap.to(".cursor", {
        duration: 1,
        top: e.pageY + "px",
        left: e.pageX + "px",
        ease: "power3.out",
      });
    }

    document.addEventListener("mousemove", updateCursor);

    return () => {
      document.removeEventListener("mousemove", updateCursor);
    };
  }, []);
  return <div className="cursor">{text}</div>;
};

export default Cursor;
