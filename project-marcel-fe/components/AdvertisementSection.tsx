import { t } from '@/lib/translate';

const AdvertisementSection = () => {
  return (
    <div className="border-y-25 border-gray-ads flex items-center justify-center h-[280px]">
      <span className="text-[32px] sm:text-[64px] uppercase text-center font-extrabold text-gray-ads">
        {t('spaceForAdvertisement')}
      </span>
    </div>
  );
};
export default AdvertisementSection;
