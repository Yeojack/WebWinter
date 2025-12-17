// src/hooks/useSidebar.js

import { useCallback, useState } from 'react';

export default function useSidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, toggle };
}
