"use client";

import Toast from "@/components/toast";
import { useState } from "react";

const Home = () => {
  const [toastShow, setToastShow] = useState<boolean>(false);

  const handleGetSearchEngine = () => {
    navigator.clipboard.writeText(`${window.location.href}api/search?q=%s`);
    setToastShow(true);
    setTimeout(() => setToastShow(false), 3000);
  };

  return (
    <>
      <main className="bg-pattern relative flex min-h-screen flex-col items-center">
        <section className="my-auto flex flex-col items-center gap-8">
          <h1 className="text-10xl text-shadow-custom select-none">Prefix.</h1>
          <div className="flex flex-col items-center gap-4">
            <p className="text-shadow-custom text-5xl">
              Get There in a Single Keystroke.
            </p>
            <p className="text-shadow-custom text-2xl">
              Define your destination with a bang:
              <code className="bg-secondary mx-1 rounded-md p-1 text-center">
                !w
              </code>
              ,
              <code className="bg-secondary mx-1 rounded-md p-1 text-center">
                !a
              </code>
              ,
              <code className="bg-secondary mx-1 rounded-md p-1 text-center">
                !yt
              </code>
              , and thousands more.
            </p>
          </div>
          <button
            onClick={handleGetSearchEngine}
            className="group/CTA text-shadow-custom bg-secondary relative z-10 overflow-hidden rounded-sm px-12 py-5 text-2xl font-medium transition-all duration-300 outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/50 active:scale-95 md:px-16 md:py-6"
          >
            <span className="absolute inset-0 -z-10 scale-0 rounded-full bg-indigo-600 transition-transform duration-700 group-hover/CTA:scale-150 group-hover/CTA:duration-500" />
            <span className="absolute inset-0 -z-10 scale-0 rounded-full bg-indigo-800 transition-transform duration-500 group-hover/CTA:scale-125 group-hover/CTA:duration-700" />
            <span className="relative z-10">Get Search Engine</span>
          </button>
        </section>
        {toastShow && <Toast onClose={() => setToastShow(false)} />}
      </main>
    </>
  );
};
export default Home;
