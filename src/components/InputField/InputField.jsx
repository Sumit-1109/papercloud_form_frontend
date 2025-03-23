import { useState } from "react";
import './InputField.scss';

const InputField = ({ label, value, onChange, formPlaceholder }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="input-container">
      <label
        htmlFor="input-field"
        className={`floating-label ${isFocused || value ? "active" : ""}`}
      >
        {label}
      </label>
      <input
        id="input-field"
        type="text"
        value={value}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => !e.target.value && setIsFocused(false)}
        onChange={onChange}
        className="floating-input"
        placeholder={(isFocused && formPlaceholder) || ""}
      />
    </div>
  );
};

export default InputField;
