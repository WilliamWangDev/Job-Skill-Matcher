const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="p-8 text-center text-gray-600 text-sm">
      <p>
        &copy; {currentYear} William Wang. All rights reserved. |{" "}
        {/* add Github hyperlink */}
         <a
          href="https://github.com/WilliamWangDev/Job-Skill-Matcher"
          aria-label="GitHub repository"
        //   add hover effect underline and change text color to gray-800
        className="hover:underline text-gray-800"
          
        >
          GitHub
        </a>
      </p>
    </footer>
  );
};

export default Footer;
