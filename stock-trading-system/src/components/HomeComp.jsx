import { useState } from "react";

const HomeComp = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    FullName: "",
    Username: "",
    Email: "",
    Password: "",
    UserType: "Customer",
    UsernameOrEmail: "",
  });
  const [message, setMessage] = useState("");

  const toggleForm = () => {
    setIsRegister((prev) => !prev);
    setMessage("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isRegister ? "/api/register" : "/api/login";
    const body = isRegister
      ? {
          FullName: formData.FullName,
          Username: formData.Username,
          Email: formData.Email,
          Password: formData.Password,
          UserType: "Customer",
        }
      : {
          UsernameOrEmail: formData.UsernameOrEmail,
          Password: formData.Password,
        };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      // Auto-login after registration
      if (isRegister) {
        const loginRes = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            UsernameOrEmail: formData.Username,
            Password: formData.Password,
          }),
        });

        const loginData = await loginRes.json();

        if (!loginRes.ok) {
          throw new Error(loginData.error || "Login failed after registration.");
        }

        localStorage.setItem("user", JSON.stringify(loginData.user));
        window.location.href = "/dashboard";
      } else if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="flex flex-col bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100">
      <section className="h-screen flex flex-col items-center justify-center text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white relative px-4">
        <h2 className="text-4xl font-bold mb-4">
          Trade Smarter. Invest Better.
        </h2>
        <p className="text-lg mb-6">
          Real-time data. Custom portfolios. Simplified trading.
        </p>

        {/* Auth Card */}
        <div className="bg-white text-zinc-900 rounded-xl shadow-lg p-6 w-full max-w-md space-y-4">
          <h3 className="text-2xl font-bold text-center">
            {isRegister ? "Create Account" : "Login"}
          </h3>

          <form className="space-y-3 text-left" onSubmit={handleSubmit}>
            {isRegister && (
              <>
                <input
                  className="w-full p-2 rounded border"
                  type="text"
                  name="FullName"
                  placeholder="Full Name"
                  onChange={handleChange}
                />
                <input
                  className="w-full p-2 rounded border"
                  type="text"
                  name="Username"
                  placeholder="Username"
                  onChange={handleChange}
                />
                <input
                  className="w-full p-2 rounded border"
                  type="email"
                  name="Email"
                  placeholder="Email"
                  onChange={handleChange}
                />
              </>
            )}

            {!isRegister && (
              <input
                className="w-full p-2 rounded border"
                type="text"
                name="UsernameOrEmail"
                placeholder="Username or Email"
                onChange={handleChange}
              />
            )}

            <input
              className="w-full p-2 rounded border"
              type="password"
              name="Password"
              placeholder="Password"
              onChange={handleChange}
            />

            {isRegister && (
              <div className="text-sm text-left space-y-1 mt-2">
                <p
                  className={`${
                    formData.Password.length >= 8
                      ? "text-green-600"
                      : "text-zinc-500"
                  }`}
                >
                  Minimum 8 characters
                </p>
                <p
                  className={`${
                    /\d/.test(formData.Password)
                      ? "text-green-600"
                      : "text-zinc-500"
                  }`}
                >
                  At least one number
                </p>
                <p
                  className={`${
                    /[@$!%*?&]/.test(formData.Password)
                      ? "text-green-600"
                      : "text-zinc-500"
                  }`}
                >
                  At least one special character (@$!%*?&)
                </p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              {isRegister ? "Sign Up" : "Login"}
            </button>
          </form>

          {message && <p className="text-center text-sm mt-2">{message}</p>}

          <p className="text-sm text-center">
            {isRegister ? (
              <>
                Already have an account?{" "}
                <button
                  onClick={toggleForm}
                  className="text-blue-600 hover:underline"
                >
                  Login
                </button>
              </>
            ) : (
              <>
                Don’t have an account?{" "}
                <button
                  onClick={toggleForm}
                  className="text-blue-600 hover:underline"
                >
                  Sign up
                </button>
              </>
            )}
          </p>
        </div>

 
      </section>

      <section className="h-screen flex flex-col items-center justify-center text-center bg-white dark:bg-zinc-800">
        <h2 className="text-3xl font-bold mb-4">Features</h2>
        <ul className="space-y-3 text-lg">
          <li>📈 Live Market Data</li>
          <li>📊 Custom Portfolio Tracking</li>
          <li>🔔 Real-Time Alerts</li>
        </ul>
      </section>

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
