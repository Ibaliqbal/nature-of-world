"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

const Preload = ({ setPreload }) => {
  useGSAP(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setPreload(false);
      },
    });
    tl.set(".body", {
      overflow: "hidden",
    });

    tl.fromTo(
      ".preload-text",
      { x: -100 },
      {
        x: 0,
        duration: 1,
        ease: "power4.out",
        delay: 0.5,
      }
    )
      .to(
        ".preload-progress-bar",
        {
          scaleX: 0.075,
          duration: 1,
          ease: "power3.out",
        },
        "<"
      )
      .to(".preload-text", {
        textContent: 100,
        duration: 3,
        ease: "sine.inOut",
        delay: 0.5,
        snap: {
          textContent: 1,
        },
      })
      .to(
        ".preload-progress-bar",
        {
          scaleX: 1,
          duration: 3,
          ease: "sine.out",
        },
        "<"
      )
      .to(".preload-text", {
        x: -100,
        duration: 1,
        ease: "power4.out",
        delay: 1,
      })
      .to(
        ".preload-progress-bar",
        { opacity: 0, duration: 1, ease: "power4.out" },
        "<"
      )
      .to(".block", {
        scaleX: 0,
        duration: 1,
        ease: "power2.out",
      })
      .to(".body", {
        overflow: "visible",
      });
  });
  return (
    <section className="preload">
      <div className="blocks">
        {Array.from({ length: 50 }).map((_, i) => (
          <div className="block" key={i} />
        ))}
      </div>
      <div className="preload-progress">
        <p className="preload-text">0</p>
        <div className="preload-progress-bar" />
      </div>
    </section>
  );
};

export default Preload;
