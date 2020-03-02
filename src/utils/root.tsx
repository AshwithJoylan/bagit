import React from 'react';
import AlertComponent from './alert';

interface AlertProps {
  title?: string; // Title
  description?: string; // Description or Sub title
  confirmText?: string; // Confirm button text
  cancelText?: string; // Cancel button Text
  cancelable?: boolean; // Weather alert is cancelable or not
  onConfirm?: () => void;
  backgroundBackEnabled?: boolean;
}

let Alert: AlertComponent | null = null;

// Component
const CustomRoot = (props: {children: React.ReactNode}) => {
  return (
    <>
      <AlertComponent ref={ref => (Alert = ref)} />
      {props.children}
    </>
  );
};

export default CustomRoot;

export {Alert};
