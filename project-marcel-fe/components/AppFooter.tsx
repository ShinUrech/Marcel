import { t } from '@/lib/translate';
import { Icon } from '@iconify/react/dist/iconify.js';
import localFont from 'next/font/local';
import { Figtree } from 'next/font/google';

const franklinGothic = localFont({
  src: '../public/fonts/Franklin Gothic Heavy Regular.ttf',
});

const figtree = Figtree({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-figtree',
});

const AppFooter = () => {
  return (
    <footer className="py-2 px-6" style={{ backgroundColor: '#0B2545' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6 md:py-10 mb-3 flex flex-col flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-1 bg-orange rounded-full"></span>
            <h2
              className={`lg:text-[28px] uppercase text-[24px] text-white ${franklinGothic.className}`}
            >
              {t('siteName')}
            </h2>
          </div>
          <p className={`text-orange text-sm font-medium ${figtree.className}`}>Rail Services</p>
          {/* Social Media Section */}
          <div className="flex items-center space-x-4 mt-2">
            <span className="text-xl cursor-pointer text-gray-300 hover:text-orange transition-colors">
              <Icon icon="bxl:twitter" width="30" height="30"></Icon>
            </span>
            <span className="text-xl cursor-pointer text-gray-300 hover:text-orange transition-colors">
              <Icon icon="bxl:facebook" width="30" height="30"></Icon>
            </span>
            <span className="text-xl cursor-pointer text-gray-300 hover:text-orange transition-colors">
              <Icon icon="bxl:instagram" width="30" height="30"></Icon>
            </span>
            <span className="text-xl cursor-pointer text-gray-300 hover:text-orange transition-colors">
              <Icon icon="bxl:youtube" width="30" height="30"></Icon>
            </span>
            <span className="text-xl cursor-pointer text-gray-300 hover:text-orange transition-colors">
              <Icon icon="bxl:telegram" width="30" height="30"></Icon>
            </span>
          </div>
          <div className="w-full h-px bg-gray-600 my-3"></div>
          <div
            className={`flex flex-col gap-2 text-sm text-gray-300 ${figtree.className}`}
          >
            <span className="text-orange font-medium">{t('footerServices')}</span>
            <span>{t('footerText')}</span>
            <span>{t('footerInfo')}</span>
            <span className="text-xs text-gray-400 mt-1">{t('footerDisclaimer')}</span>
            <span className="text-gray-400 mt-2">{t('copyright')}</span>
          </div>
        </div>
        {/* <div className="mx-auto grid lg:grid-cols-2 sm:grid-cols-1 gap-10 text-sm text-gray-700">
          <div className="grid grid-cols-3 lg:gap-5 sm:gap-1 text-sm text-gray-700">
            <div>
              <span className="border-t pb-4 flex w-4/5 border-gray"></span>
              <h3 className="font-bold text-blue pb-4">ABOUT</h3>
              <ul className="space-y-2">
                <li>About Us</li>
                <li>Advertising</li>
                <li>Careers</li>
                <li>Construction News</li>
                <li>Research</li>
              </ul>
            </div>

            <div>
              <span className="border-t pb-4 flex w-4/5 border-gray"></span>
              <h3 className="font-bold text-blue  pb-4">CONTACT</h3>
              <ul className="space-y-2">
                <li>Contact Us</li>
                <li>Customer Center</li>
                <li>Accessibility</li>
                <li>Sitemap</li>
                <li>Cancel Subscription</li>
              </ul>
            </div>
            <div>
              <span className="border-t pb-4 flex w-4/5 border-gray"></span>
              <h3 className="font-bold text-blue  pb-4">CONTACT</h3>
              <ul className="space-y-2">
                <li>Contact Us</li>
                <li>Customer Center</li>
                <li>Accessibility</li>
                <li>Sitemap</li>
                <li>Cancel Subscription</li>
              </ul>
            </div>
          </div>
          <div>
            <span className="border-t pb-4 flex border-gray"></span>
            <h3 className="font-bold text-blue pb-4">DISCLOSURE</h3>
            <p className="text-xs leading-5">
              Please note that our Privacy Policy, Terms of Use, Cookies Policy,
              and Do Not Sell My Personal Information guidelines have been
              updated.
              <br />
              <br />
              Construction Insider is an award-winning media outlet dedicated to
              providing the latest news, insights, and analysis for the
              construction industry. Our team of journalists adheres to a strict
              set of editorial policies designed to maintain integrity,
              independence, and unbiased reporting. We are committed to covering
              the construction industry with transparency and professionalism,
              ensuring our audience receives accurate and timely information to
              stay informed about the sector&apos;s developments.
            </p>
          </div>
        </div> */}
      </div>
    </footer>
  );
};
export default AppFooter;
