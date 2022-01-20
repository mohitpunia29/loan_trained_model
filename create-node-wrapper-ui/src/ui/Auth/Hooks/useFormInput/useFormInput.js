import { useState } from 'react';

export default function useFormInput(initialValue, setFormError) {
  const [value, setValue] = useState(initialValue);

  function handleChange(e) {
    setValue(e.target.value);
    setFormError('');
  }

  return [value, handleChange];
}
