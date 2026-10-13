import { useEffect, useState } from 'react';

interface AdBannerSystemProps {
  placement?: string;
}

const MONETAG_ZONES = [
  { id: 'monetag-banner-1', zoneId: 'YOUR_ZONE_ID_1' },
  { id: 'monetag-banner-2', zoneId: 'YOUR_ZONE_ID_2' },
  { id: 'monetag-banner-3', zoneId: 'YOUR_ZONE_ID_3' },
];

export default function AdBannerSystem({ placement = 'home' }: AdBannerSystemProps) {
  const [currentAd, setCurrentAd] = useState(0);

  useEffect(() => {
    // Rotate ad every 8 seconds
    const interval = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % MONETAG_ZONES.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Load Monetag Script only once
    const existingScript = document.getElementById('monetag-script');
    if (existingScript) return;

    const script = document.createElement('script');
    script.id = 'monetag-script';
    // Replace this with your actual Monetag tag URL
    script.src = 'https://alwingulla.com/88/tag.min.js';
    script.dataset.zone = MONETAG_ZONES[currentAd].zoneId;
    script.async = true;
    document.body.appendChild(script);
  }, [currentAd]);

  return (
    <div className="w-full flex justify-center my-4">
      <div
        id={MONETAG_ZONES[currentAd].id}
        className="min-h-[90px] w-full max-w-[728px] bg-gray-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center overflow-hidden"
      >
        {/* Monetag will render ad here */}
        <span className="text-xs text-gray-400">Advertisement</span>
      </div>
    </div>
  );
          }
