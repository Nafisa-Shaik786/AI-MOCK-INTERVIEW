import { useLocation, useNavigate } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { brainwaveSymbol } from "../assets";
import { navigation } from "../constants";
import Button from "./Button";
import MenuSvg from "../assets/svg/MenuSvg";
import { useState, useEffect } from "react";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openNavigation, setOpenNavigation] = useState(false);

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, [location.pathname]);

  const toggleNavigation = () => {
    setOpenNavigation((prev) => {
      const isOpen = !prev;
      isOpen ? disablePageScroll() : enablePageScroll();
      return isOpen;
    });
  };

  const handleSignOut = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const hideUserButtons = ["/interview", "/dsadashboard"].includes(location.pathname);

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 border-b border-gray-200 bg-white/95 backdrop-blur-md shadow-sm"
    >
      <div className="flex items-center justify-between px-5 lg:px-8 xl:px-12 py-1">
        {/* Logo */}
        <span
          onClick={() => navigate("/")}
          className="flex items-center cursor-pointer"
        >
          <img src={brainwaveSymbol} alt="MockAi" className="w-6 h-6" />
          <span className="ml-3 font-semibold text-lg text-blue-700 tracking-wide">
            MockAi
          </span>
        </span>

        {/* Navigation */}
        <nav
          className={`${
            openNavigation ? "flex" : "hidden"
          } fixed top-[4.5rem] left-0 right-0 bottom-0 bg-white lg:static lg:flex lg:mx-auto lg:bg-transparent`}
        >
          <div className="relative z-20 flex flex-col items-center justify-center m-auto lg:flex-row">
            {navigation.map((item) => (
              <span
                key={item.id}
                onClick={() => {
                  setOpenNavigation(false);
                  navigate(item.url);
                }}
                className={`cursor-pointer block font-sans text-lg uppercase tracking-wider transition-colors hover:text-blue-600
                  ${item.onlyMobile ? "lg:hidden" : ""}
                  px-4 py-3 lg:-mr-1 lg:text-sm lg:font-semibold
                  ${
                    item.url === location.pathname
                      ? "text-blue-700 font-bold"
                      : "lg:text-gray-500"
                  }
                  lg:leading-5 lg:hover:text-blue-700 xl:px-12`}
              >
                {item.title}
              </span>
            ))}
          </div>
        </nav>

        {/* Right Side (Buttons) */}
        <div className="flex items-center space-x-4">
          {user && !hideUserButtons ? (
            <>
              {user.username && (
                <span className="text-blue-800 font-medium hidden sm:block">
                  Hello, {user.username}
                </span>
              )}
              <Button
                onClick={() => navigate("/profile")}
                className="px-4 py-1 text-blue-700 border border-blue-700 rounded-md hover:bg-blue-50 transition"
              >
                Profile
              </Button>
              <Button
                onClick={handleSignOut}
                className="px-4 py-1 text-blue-700 border border-blue-700 rounded-md hover:bg-blue-50 transition"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              {location.pathname !== "/signup" && (
                <Button
                  onClick={() => navigate("/signup")}
                  className="px-4 py-1 rounded-md font-semibold text-blue-700 border border-blue-700 hover:bg-blue-50 transition"
                >
                  Sign Up
                </Button>
              )}
              {location.pathname !== "/login" && (
                <Button
                  onClick={() => navigate("/login")}
                  className="px-4 py-1 rounded-md font-semibold text-blue-700 border border-blue-700 hover:bg-blue-50 transition"
                >
                  Log In
                </Button>
              )}
            </>
          )}
        </div>

        {/* Hamburger Icon for mobile */}
        <div className="lg:hidden ml-2">
          <Button
            className="text-blue-700"
            px="px-3"
            onClick={toggleNavigation}
            icon
          >
            <MenuSvg openNavigation={openNavigation} />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
