import Header from '../components/Header';
import Hero from '../components/Hero';
import About from '../components/About';
import Courses from '../components/Courses';
import Blogs from '../components/Blogs';
import Teachers from '../components/Teachers';
import Reviews from '../components/Reviews';
import Contacts from '../components/Contacts';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Courses />
        <Blogs />
        <Teachers />
        <Reviews />
        <Contacts />
      </main>
      <Footer />
    </>
  );
}
