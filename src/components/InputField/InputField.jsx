import { useState } from "react";
import './InputField.scss';

const InputField = ({ label, value, onChange, formPlaceholder, type }) => {
  const [isFocused, setIsFocused] = useState(false);
  let selectedType;
  if(type === 'TEXT') selectedType = 'text';
  if(type === 'EMAIL') selectedType = 'email';
  if(type === 'PASSWORD') selectedType = 'password';
  if(type === 'DATE') selectedType = 'date';
  if(type === 'NUMBER') selectedType = 'number';

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
        type={selectedType}
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
