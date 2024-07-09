import React from "react";

const LanguageButtons = ({ selectedLanguage, changeLanguage }) => {
  return (
    <div className="language-buttons">
      <button
        onClick={() => changeLanguage("es")}
        disabled={selectedLanguage === "es"}
      >
        ES
      </button>
      <button
        onClick={() => changeLanguage("en")}
        disabled={selectedLanguage === "en"}
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage("de")}
        disabled={selectedLanguage === "de"}
      >
        DE
      </button>
    </div>
  );
};

export default LanguageButtons;
