"use client";

import { Title } from "./Title";
import { StepsList } from "./StepsList";
import { useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

export default function HowItWorks() {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  useEffect(() => {
    controls.start(inView ? "visible" : "hidden");
  }, [controls, inView]);
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <Title />
        <div ref={ref}>
          <StepsList controls={controls} />
        </div>
      </div>
    </section>
  );
}
