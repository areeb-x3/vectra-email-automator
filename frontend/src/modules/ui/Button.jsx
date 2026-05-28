import React from 'react';
import { Link } from 'react-router-dom';
import './Button.css';

const Button = ({ children, variant = 'primary', size = 'md', onClick, className = '', href, to, ...props }) => {
  if (to) {
    return (
      <Link
        to={to}
        className={`btn btn-${variant} btn-${size} ${className}`}
        onClick={onClick}
        {...props}
      >
        {children}
      </Link>
    );
  }

  const Component = href ? 'a' : 'button';
  
  return (
    <Component 
      className={`btn btn-${variant} btn-${size} ${className}`} 
      onClick={onClick}
      href={href}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Button;
