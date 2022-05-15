import React, { useState } from 'react';
import './input.scss';

type InputProps = {
  label?: string;
  value: string;
  onChange: (v: string) => void;
};

const Input = ({ label, value, onChange: onChangeCallback }: InputProps) => {
  const [local, setLocal] = useState(value);

  const onChange = (e: any) => {
    setLocal(e.target.value);
  };

  const onBlur = () => {
    onChangeCallback(local);
  };

  return (
    <div className="input">
      {label && <label className="input__label">{label}</label>}
      <input
        className="input__field"
        type="text"
        value={local}
        onChange={onChange}
        onBlur={onBlur}
      />
    </div>
  );
};

export default Input;

