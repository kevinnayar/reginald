import { useState } from 'react';

type UseToggleHook = [boolean, () => void];

export default function useToggle(initialValue: boolean): UseToggleHook {
  const [value, setValue] = useState(initialValue);
  const toggleValue = () => setValue(!value);
  return [value, toggleValue];
}



