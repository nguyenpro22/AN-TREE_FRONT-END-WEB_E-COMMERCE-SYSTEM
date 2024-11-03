"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Mockup() {
  return (
    <section className="bg-green-50 py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
            Trải Nghiệm Antree Trên Di Động
          </h2>
          <p className="text-green-600 text-lg max-w-2xl mx-auto">
            Khám phá ứng dụng di động của chúng tôi với giao diện thân thiện và
            đầy đủ tính năng
          </p>
        </motion.div>
        <div className="relative max-w-4xl  mx-auto">
          <Image
            src="/mockup_all.png"
            alt="Antree App Mockup"
            width={600}
            height={600}
            className="w-[500px] h-auto mx-auto"
            priority
          />
        </div>
      </div>
    </section>
  );
}
