import Hero  from '@/src/components/HeroSection';
import HowItWorks from '@/src/components/HowItWorks';
import WhySection from  '@/src/components/WhySection';
import ExampleSection from '@/src/components/ExampleSection';
import CTASection from '@/src/components/CTASection';
import Footer from '@/src/components/Footer';

export default function Home() {
  return (
    <div>
      <Hero />
      <HowItWorks />
      <WhySection />
      <ExampleSection />
      <CTASection />
      <Footer />
    </div>
  );
}
