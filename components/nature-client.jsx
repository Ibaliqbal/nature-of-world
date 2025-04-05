"use client";
import { useRef } from "react";
import Cursor from "./cursor";
import { usePreload } from "@/context/preload-context";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import SplitType from "split-type";
import { unstable_ViewTransition as ViewTransition } from "react";
import Link from "next/link";

const NatureClient = ({ currentNature, prevNature, nextNature }) => {
  const natureRef = useRef(null);
  const { preload } = usePreload();

  useGSAP(
    (_, contextSafe) => {
      const firstTl = gsap.timeline({
        delay: preload ? 8.5 : 0.5,
      });
      const natureVideoContainer = document.querySelector(
        ".hero-section-nature"
      );
      const splitTitle = new SplitType(".nature-title", {
        types: "chars,words,lines",
        lineClass: "clip-text",
      });

      firstTl
        .from(".cursor", {
          scale: 0,
          ease: "power4.inOut",
          duration: 0.5,
        })
        .from(splitTitle.chars, {
          y: 100,
          opacity: 0,
          stagger: {
            each: 0.05,
            from: "random",
          },
          duration: 0.8,
          ease: "power2",
        })
        .from(".keep-scrolling", {
          opacity: 0,
          duration: 0.5,
          ease: "power3",
        });

      const clickBack = contextSafe((e) => {
        const link = e.currentTarget.querySelector("a");
        if (!link) return;

        const tl = gsap.timeline({
          onComplete: () => {
            link.click();
          },
        });

        tl.to(".cursor", {
          scale: 0,
          ease: "power4.inOut",
          duration: 0.5,
        })
          .to(
            splitTitle.chars,
            {
              y: 100,
              opacity: 0,
              stagger: {
                each: 0.05,
                from: "random",
              },
              duration: 0.8,
              ease: "power2",
            },
            "<"
          )
          .to(
            ".keep-scrolling",
            {
              opacity: 0,
              duration: 0.5,
              ease: "power3",
            },
            "<"
          );
      });

      natureVideoContainer.addEventListener("click", clickBack);

      return () => {
        natureVideoContainer.removeEventListener("click", clickBack);
      };
    },
    { scope: natureRef }
  );

  return (
    <main ref={natureRef}>
      <section className="hero-section-nature">
        <ViewTransition name={`video-${currentNature.slug}`}>
          <video autoPlay playsInline muted loop className="main-video">
            <source src={currentNature.video} type="video/mp4" />
          </video>
        </ViewTransition>
        <h1 className="nature-title">{currentNature.name}</h1>
        <Link href={`/`}>Got nature home</Link>
        <p className="keep-scrolling">( Keep Scrolling )</p>
        <Cursor text="Back" />
      </section>
      <section className="intro-nature">
        <div className="container">
          <h1 className="intro-nature-title">{currentNature.name}</h1>
          <p className="intro-nature-description">
            {currentNature.description}
          </p>
        </div>
      </section>
    </main>
  );
};

export default NatureClient;
