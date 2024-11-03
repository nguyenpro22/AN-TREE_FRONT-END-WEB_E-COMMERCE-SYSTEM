import dynamic from "next/dynamic";
import Header from "@/components/Landing/Header";
import Hero from "@/components/Landing/Hero";
import Mockup from "@/components/Landing/Mockup";

const Testimonials = dynamic(
  () => import("@/components/Landing/Testimonials"),
  { ssr: false }
);
const Features = dynamic(() => import("@/components/Landing/Features"), {
  ssr: false,
});
const HowItWorks = dynamic(() => import("@/components/Landing/HowItWorks"), {
  ssr: false,
});
const Footer = dynamic(() => import("@/components/Landing/Footer"), {
  ssr: false,
});

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <Header />
      <main>
        <Hero />
        <Features />
        <Mockup />
        <HowItWorks />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
