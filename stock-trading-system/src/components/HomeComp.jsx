const HomeComp = () => {
  return (
    <div className="flex flex-col bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100">
      {/* Section 1 - Hero */}
      <section className="h-screen flex flex-col items-center justify-center text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <h2 className="text-4xl font-bold mb-4">
          Trade Smarter. Invest Better.
        </h2>
        <p className="text-lg mb-6">
          Real-time data. Custom portfolios. Simplified trading.
        </p>
        <a
          href="/dashboard"
          className="inline-block px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-zinc-200 transition"
        >
          Get Started
        </a>
      </section>

      {/* Section 2 - Features */}
      <section className="h-screen flex flex-col items-center justify-center text-center bg-white dark:bg-zinc-800">
        <h2 className="text-3xl font-bold mb-4">Features</h2>
        <ul className="space-y-3 text-lg">
          <li>📈 Live Market Data</li>
          <li>📊 Custom Portfolio Tracking</li>
          <li>🔔 Real-Time Alerts</li>
        </ul>
      </section>

      {/* Section 3 - About */}
      <section className="h-screen flex flex-col items-center justify-center text-center bg-zinc-100 dark:bg-zinc-900">
        <h2 className="text-3xl font-bold mb-4">About Us</h2>
        <p className="max-w-xl text-lg">
          We’re building the future of online trading. Our mission is to make
          investing easy, accessible, and powerful for everyone.
        </p>
      </section>
    </div>
  );
};

export default HomeComp;
