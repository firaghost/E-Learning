import React from 'react';

// Mock framer-motion components
const motion = {
  div: React.forwardRef((props: any, ref: any) => <div ref={ref} {...props} />),
  button: React.forwardRef((props: any, ref: any) => <button ref={ref} {...props} />),
  a: React.forwardRef((props: any, ref: any) => <a ref={ref} {...props} />),
  span: React.forwardRef((props: any, ref: any) => <span ref={ref} {...props} />),
  h1: React.forwardRef((props: any, ref: any) => <h1 ref={ref} {...props} />),
  h2: React.forwardRef((props: any, ref: any) => <h2 ref={ref} {...props} />),
  h3: React.forwardRef((props: any, ref: any) => <h3 ref={ref} {...props} />),
  p: React.forwardRef((props: any, ref: any) => <p ref={ref} {...props} />),
  form: React.forwardRef((props: any, ref: any) => <form ref={ref} {...props} />),
};

// Mock animation functions
export const AnimatePresence = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export { motion };

export default motion;