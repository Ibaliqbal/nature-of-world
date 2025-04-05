"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { useRef } from "react";
import Cursor from "./cursor";
import SplitType from "split-type";
import Link from "next/link";
import { usePreload } from "@/context/preload-context";
import { mainNature } from "@/config/constant";

const HomeClient = () => {
  const naturesRef = useRef(null);
  const { preload } = usePreload();

  useGSAP(
    (_, contextSafe) => {
      gsap.registerPlugin(Observer);
      const wordsTitle = gsap.utils.toArray(".nature-title");
      const splitTitle = wordsTitle.map(
        (title) =>
          new SplitType(title, {
            types: "chars,words,lines",
            lineClass: "clip-text",
          })
      );
      const natureList = document.querySelectorAll(".nature");
      const totalList = natureList.length;
      let currentIndex = -1,
        animating;

      // Set initial states for all nature sections
      gsap.set(natureList, {
        opacity: 0,
        zIndex: 0,
      });

      // Set first section visible
      gsap.set(natureList[0], {
        opacity: 1,
        zIndex: 1,
      });

      const tl = gsap.timeline({
        delay: preload ? 8.5 : 0.5,
      });

      tl.from(".cursor", {
        scale: 0,
        ease: "power4.inOut",
        duration: 0.5,
      }).from(splitTitle[0].chars, {
        y: 100,
        opacity: 0,
        stagger: {
          each: 0.05,
          from: "random",
        },
        duration: 0.8,
        ease: "power2",
      });

      function logKey(e) {
        console.log(e.code);
        if ((e.code === "ArrowRight" || e.code === "ArrowUp") && !animating) {
          goToSection((currentIndex + 1) % totalList);
        }

        if ((e.code === "ArrowLeft" || e.code === "ArrowDown") && !animating) {
          goToSection((currentIndex - 1 + totalList) % totalList);
        }
      }

      function goToSection(index) {
        if (index >= totalList || index < 0) return;

        animating = true;

        const tl = gsap.timeline({
          onComplete: () => {
            currentIndex = index;
            animating = false;
            // Remove click listener from all sections
            natureList.forEach((nature) => {
              nature.removeEventListener("click", natureClick);
            });
            // Add click listener to current section
            natureList[index].addEventListener("click", natureClick);
          },
          defaults: { duration: 1.25, ease: "power1.inOut" },
        });

        // Hide current section if exists
        if (currentIndex >= 0) {
          tl.to(natureList[currentIndex], {
            opacity: 0,
            zIndex: 0,
          });
        }

        // Show new section
        tl.to(
          natureList[index],
          {
            opacity: 1,
            zIndex: 1,
          },
          "<"
        ).from(
          splitTitle[index].chars,
          {
            y: 100,
            opacity: 0,
            stagger: {
              each: 0.02,
              from: "random",
            },
            duration: 0.5,
            ease: "power2",
          },
          ">-=0.5"
        );
      }

      Observer.create({
        type: "wheel,touch,pointer",
        onDown: () =>
          !animating && goToSection((currentIndex - 1 + totalList) % totalList),
        onUp: () => !animating && goToSection((currentIndex + 1) % totalList),
        tolerance: 10,
        preventDefault: true,
        wheelSpeed: -1,
      });

      goToSection(0);

      document.addEventListener("keydown", logKey);

      const natureClick = contextSafe(function (e) {
        if (animating) return;
        const link = e.currentTarget.querySelector("a");

        if (!link) return;

        animating = true;
        const tl = gsap.timeline({
          onComplete: () => {
            link.click();
          },
        });

        tl.to(".progress-nature", {
          opacity: 0.7,
          duration: 3,
          ease: "power1.inOut",
        }).to(".progress-nature-bar", {
          scaleX: 1,
          duration: 4,
          ease: "power3.out",
        });
      });

      // Add click listener to initial section
      natureList[0].addEventListener("click", natureClick);

      return () => {
        Observer.getAll((o) => o.kill());
        document.removeEventListener("keydown", logKey);
        // Remove click listeners from all sections
        natureList.forEach((nature) => {
          nature.removeEventListener("click", natureClick);
        });
      };
    },
    { scope: naturesRef }
  );

  return (
    <main className="natures" ref={naturesRef}>
      {mainNature.map((nature) => (
        <section className="nature" key={nature.slug}>
          <video autoPlay playsInline muted loop className="main-video">
            <source src={nature.video} type="video/mp4" />
          </video>
          <h1 className="nature-title">{nature.name}</h1>
          <Link href={`/natures/${nature.slug}`}>Got nature {nature.name}</Link>
        </section>
      ))}
      <Cursor />
      <div className="progress-nature">
        <div className="progress-nature-bar" />
      </div>
    </main>
  );
};

export default HomeClient;
