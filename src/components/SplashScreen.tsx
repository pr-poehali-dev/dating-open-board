import { useEffect, useState } from 'react';

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onFinish, 300);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ 
        WebkitUserSelect: 'none', 
        userSelect: 'none',
        touchAction: 'none'
      }}
    >
      <div className="text-white text-[120px] sm:text-[180px] md:text-[240px] lg:text-[320px] font-bold animate-scale-in">
        V
      </div>
    </div>
  );
};

export default SplashScreen;