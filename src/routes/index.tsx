import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Navbar } from "@/components/Navbar";
import { LoadingScreen } from "@/components/LoadingScreen";
import { FloatingCTA } from "@/components/FloatingCTA";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Classes } from "@/components/sections/Classes";
import { Register } from "@/components/sections/Register";
import { Footer } from "@/components/sections/Footer";

// Below-the-fold sections — load lazily after first paint to keep the
// initial JS/CSS payload small.
const Keynote = lazy(() => import("@/components/sections/Keynote").then(m => ({ default: m.Keynote })));
const Gallery = lazy(() => import("@/components/sections/Gallery").then(m => ({ default: m.Gallery })));
const Testimonials = lazy(() => import("@/components/sections/Testimonials").then(m => ({ default: m.Testimonials })));
const FAQ = lazy(() => import("@/components/sections/FAQ").then(m => ({ default: m.FAQ })));
const Venue = lazy(() => import("@/components/sections/Venue").then(m => ({ default: m.Venue })));
const Contact = lazy(() => import("@/components/sections/Contact").then(m => ({ default: m.Contact })));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kwara Kre8ives 2.0 — Empowering 2,000 Creatives" },
      {
        name: "description",
        content:
          "Join 2,000 creatives at Kwara Kre8ives 2.0 on 30th June 2026 in Ilorin. Free training in photography, videography, content creation, branding and more.",
      },
      { property: "og:title", content: "Kwara Kre8ives 2.0 — National Creative Summit" },
      {
        property: "og:description",
        content:
          "A premier creative summit empowering 2,000 young creatives across Nigeria. Reserve your free spot today.",
      },
    ],
  }),
  component: Index,
});

function SectionFallback() {
  return <div className="min-h-[400px]" aria-hidden />;
}

function Index() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {loading && <LoadingScreen />}
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Suspense fallback={<SectionFallback />}>
          <Keynote />
        </Suspense>
        <Classes />
        <Register />
        <Suspense fallback={<SectionFallback />}>
          <Gallery />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Testimonials />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <FAQ />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Venue />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Contact />
        </Suspense>
      </main>
      <Footer />
      <FloatingCTA />
    </>
  );
}
