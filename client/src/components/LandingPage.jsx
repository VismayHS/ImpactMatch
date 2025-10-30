import HeroNew from './HeroNew';
import About from './About';
import Features from './Features';
import CausesFeed from './CausesFeed';
import Footer from './Footer';

const LandingPage = () => {
  return (
    <div className="scroll-smooth">
      <HeroNew />
      <About />
      <Features />
      <CausesFeed />
      <Footer />
    </div>
  );
};

export default LandingPage;
