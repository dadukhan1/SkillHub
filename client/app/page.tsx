import Header from "./components/Header";
import Footer from "./components/layout/Footer";
import Hero from "./components/landing/Hero";
import FeaturedCourses from "./components/landing/FeaturedCourses";
import Categories from "./components/landing/Categories";
import InstructorHighlights from "./components/landing/InstructorHighlights";
import Testimonials from "./components/landing/Testimonials";
import CtaSection from "./components/landing/CtaSection";
import FAQ from "./components/landing/FAQ";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <FeaturedCourses />
        <Categories />
        <section id="instructors">
          <InstructorHighlights />
        </section>
        <Testimonials />
        <FAQ />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
