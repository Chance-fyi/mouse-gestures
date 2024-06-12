import React, {useState, useEffect} from 'react';

const Alert = ({message, duration, onClose}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  useEffect(() => {
    if (!visible) {
      const removeTimer = setTimeout(() => {
        onClose();
      }, 500);

      return () => clearTimeout(removeTimer);
    }
  }, [visible, onClose]);

  return (
    <div
      className={`transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'} alert alert-success flex h-5 items-center justify-center`}
    >
      <span className="text-white">{message}</span>
    </div>
  );
};

export default Alert;