"use client";
import {
  useMotionValueEvent,
  useScroll,
  useTransform,
  motion,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import styles from "@/app/bubble.module.css";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  const { scrollYProgress: headerScroll } = useScroll({
    target: containerRef,
    offset: ["start 90%", "start 40%"],
  });

  const yH2 = useTransform(headerScroll, [0, 1], [50, 0]);
  const yH3 = useTransform(headerScroll, [0, 1], [100, 0]);
  const yP = useTransform(headerScroll, [0, 1], [150, 0]);
  
  // 3D Transforms
  const rotateXHeader = useTransform(headerScroll, [0, 1], [25, 0]);
  const scaleHeader = useTransform(headerScroll, [0, 1], [0.92, 1]);
  const opacityHeader = useTransform(headerScroll, [0, 0.5, 1], [0, 0.9, 1]);

  return (
    <div
      className="w-full bg-[#fafcff] font-sans md:px-10"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10" style={{ perspective: "1000px" }}>
        <motion.h2 
          style={{ y: yH2, opacity: opacityHeader }}
          className="text-xs font-black tracking-[0.2em] text-[#00b4d8] uppercase mb-4 flex items-center gap-4"
        >
          <span className="w-12 h-[2px] bg-[#00b4d8]"></span> Our Expertise
        </motion.h2>
        <motion.h3 
          style={{ 
            y: yH3, 
            opacity: opacityHeader,
            rotateX: rotateXHeader,
            scale: scaleHeader,
            transformOrigin: "bottom"
          }}
          className="text-4xl lg:text-5xl font-black text-[#0a1128] tracking-tight leading-[1.1] mb-6"
        >
          <motion.span
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{ visible: { transition: { staggerChildren: 0.009 } } }}
          >
            {"Comprehensive Solutions".split("").map((char, idx) => (
              <motion.span
                key={idx}
                variants={{
                  hidden: { opacity: 0, y: 14 },
                  visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 10, stiffness: 500 } }
                }}
                className={styles.hoverText}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.span>
          <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0a1128] to-[#00b4d8] opacity-80">
            <motion.span
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={{ visible: { transition: { staggerChildren: 0.009, delayChildren: 0.1 } } }}
            >
              {"for the Modern Enterprise.".split("").map((char, idx) => (
                <motion.span
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 12, stiffness: 300 } }
                  }}
                  className={styles.hoverText}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </motion.span>
          </span>
        </motion.h3>
        <motion.p 
          style={{ y: yP, opacity: opacityHeader }}
          className="text-slate-500 text-sm md:text-base max-w-sm"
        >
          We offer a tailored range of services engineered to meet the sophisticated needs of today&apos;s highest-performing teams.
        </motion.p>
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 md:pt-32 md:gap-10"
          >
            {/* Sticky title column */}
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              {/* Animated dot */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.1 }}
                className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-white flex items-center justify-center shadow-md"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.25 }}
                  className="h-4 w-4 rounded-full bg-[#00b4d8] border-2 border-white shadow-[0_0_12px_rgba(0,180,216,0.6)]"
                />
              </motion.div>

              {/* Title sliding in from left */}
              <motion.h3
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.15 }}
                className="hidden md:block text-xl md:pl-20 md:text-4xl font-bold text-[#0a1128]"
              >
                {item.title}
              </motion.h3>
            </div>

            {/* Content sliding in from right/bottom */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.97, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ type: "spring", stiffness: 100, damping: 22, delay: 0.2 }}
              className="relative pl-20 pr-4 md:pl-4 w-full"
            >
              <h3 className="md:hidden block text-2xl mb-4 text-left font-bold text-[#0a1128]">
                {item.title}
              </h3>
              {item.content}{" "}
            </motion.div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-gray-200 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-[#00b4d8] via-[#0077b6] to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
