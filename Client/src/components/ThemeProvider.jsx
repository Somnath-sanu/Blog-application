/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";



function ThemeProvider({ children }) {
  const { theme } = useSelector((state) => state.theme);
  return ( //dark:bg-[rgb(16,23,42)]
    <div className={theme}>
      <div className="bg-white text-gray-700 dark:text-gray-200  min-h-screen dark:bg-[rgb(16,23,42)]">
        {children}
      </div>
    </div>
  );
}

export default ThemeProvider;
