import { useState, useCallback, useRef } from 'react';

interface UseLongPressOptions {
  onLongPress: () => void;
  onClick?: () => void;
  duration?: number;
}

export const useLongPress = ({ onLongPress, onClick, duration = 500 }: UseLongPressOptions) => {
  const [showMenu, setShowMenu] = useState(false);
  const timerRef = useRef<any>(null);
  const isLongPressActive = useRef(false);

  const start = useCallback(() => {
    isLongPressActive.current = false;
    timerRef.current = setTimeout(() => {
      onLongPress();
      setShowMenu(true);
      isLongPressActive.current = true;
    }, duration);
  }, [onLongPress, duration]);

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleClick = useCallback(() => {
    if (isLongPressActive.current) {
      isLongPressActive.current = false;
      return;
    }
    
    if (!showMenu && onClick) {
      onClick();
    }
    setShowMenu(false);
  }, [showMenu, onClick]);

  const closeMenu = useCallback(() => {
    setShowMenu(false);
  }, []);

  return {
    showMenu,
    closeMenu,
    handlers: {
      onMouseDown: start,
      onMouseUp: stop,
      onMouseLeave: stop,
      onTouchStart: start,
      onTouchEnd: stop,
      onClick: handleClick,
    },
  };
};
