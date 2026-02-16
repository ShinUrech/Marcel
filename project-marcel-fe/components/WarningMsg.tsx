import { t } from '@/lib/translate';
import Link from 'next/link';

const WarningMsg = ({ returnToHome }: { returnToHome: boolean }) => {
  return (
    <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[120px] flex-grow">
      <div className="flex flex-col items-center justify-center gap-5 h-[300px]">
        <span className="text-lg uppercase font-semibold text-blue text-center">
          {t('somethingWrong')}
        </span>
        {returnToHome && (
          <Link href="/" className="btn-lg">
            {t('goBackHome')}
          </Link>
        )}
      </div>
    </main>
  );
};
export default WarningMsg;
