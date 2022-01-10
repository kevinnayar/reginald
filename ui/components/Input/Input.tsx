import React from 'react';
import './input.scss';

type InputProps = {
  label?: string;
  value: string;
  onChange: (v: string) => void;
};

const Input = ({ label, value, onChange }: InputProps) => {
  const onValueChange = (e: any) => {
    onChange(e.target.value);
  };

  return (
    <div className="input">
      {label && <label className="input__label">{label}</label>}
      <input
        className="input__field"
        type="text"
        value={value}
        onChange={onValueChange}
      />
    </div>
  );
};

export default Input;

