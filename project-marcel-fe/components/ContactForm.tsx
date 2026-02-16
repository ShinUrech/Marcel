'use client';
import { t } from '@/lib/translate';
import localFont from 'next/font/local';
import { useState } from 'react';

const franklinGothic = localFont({
  src: '../public/fonts/Franklin Gothic Heavy Regular.ttf',
});
const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    setResponse(data.message);
    setLoading(false);
  };
  return (
    <div className="flex flex-col justify-between flex-1 py-10">
      <div>
        <span className={`text-[36px] ${franklinGothic.className}`}>
          {t('getInTouchTitle')}
        </span>
        <p className={`text-[20px]`}>{t('getInTouchText')}</p>
      </div>
      {response && (
        <div className="mt-10">
          <div
            role="alert"
            className="mt-3 relative flex w-full p-3 text-sm text-slate-600 rounded-md bg-slate-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="h-5 w-5 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
              ></path>
            </svg>
            {response}
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6 mt-15">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="UserFirstName"
                className="block font-bold text-blue pb-1"
              >
                {t('firstNameLabel')}
              </label>

              <input
                type="text"
                id="UserFirstName"
                name="firstname"
                disabled={loading}
                onChange={handleChange}
                placeholder={t('firstNamePlaceholder')}
                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border input-blue-30 rounded-xs px-3 py-5 transition duration-300 ease focus:outline-none focus:border-blue-300 hover:border-blue-200 focus:shadow"
              />
            </div>
            <div>
              <label
                htmlFor="UserLastName"
                className="block font-bold text-blue pb-1"
              >
                {t('lastNameLabel')}
              </label>

              <input
                onChange={handleChange}
                type="text"
                name="lastname"
                disabled={loading}
                id="UserLastName"
                placeholder={t('lastNamePlaceholder')}
                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border input-blue-30 rounded-xs px-3 py-5 transition duration-300 ease focus:outline-none focus:border-blue-300 hover:border-blue-200 focus:shadow"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="UserEmail"
              className="block font-bold text-blue pb-1"
            >
              {t('emailLabel')}
            </label>

            <input
              type="email"
              id="UserEmail"
              name="email"
              disabled={loading}
              onChange={handleChange}
              placeholder={t('emailPlaceholder')}
              className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border input-blue-30 rounded-xs px-3 py-5 transition duration-300 ease focus:outline-none focus:border-blue-300 hover:border-blue-200 focus:shadow"
            />
          </div>
          <div>
            <label
              htmlFor="UserEmail"
              className="block font-bold text-blue pb-1"
            >
              {t('messageLabel')}
            </label>

            <textarea
              id="UserEmail"
              rows={4}
              name="message"
              disabled={loading}
              onChange={handleChange}
              placeholder={t('messagePlaceholder')}
              className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border input-blue-30 rounded-xs px-3 py-5 transition duration-300 ease focus:outline-none focus:border-blue-300 hover:border-blue-200 focus:shadow"
            />
          </div>
          <div className="flex justify-center">
            <button type="submit" className="btn-lg flex">
              {loading ? (
                <svg
                  className="text-gray-300 animate-spin"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                >
                  <path
                    d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <path
                    d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue"
                  ></path>
                </svg>
              ) : (
                t('submit')
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default ContactForm;
