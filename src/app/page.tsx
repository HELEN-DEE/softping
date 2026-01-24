import Hero  from '@/src/components/HeroSection';
import HowItWorks from '@/src/components/HowItWorks';
import WhySection from  '@/src/components/WhySection';

export default function Home() {
  return (
    <div>
      <Hero />
      <HowItWorks />
      <WhySection />
    </div>
  );
}
