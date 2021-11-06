import clsx from 'clsx';
import React, { forwardRef, MouseEvent, Ref } from 'react';

import styles from './Button.module.scss';

const colors = {
  green: styles.buttonGreen,
  gray: styles.buttonGray,
  blue: styles.buttonBlue,
};

interface ButtonProps {
  disabled?: boolean;
  color?: 'green' | 'gray' | 'blue';
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  children: React.ReactNode
}

export const Button = forwardRef(({
  children,
  disabled,
  color = 'green',
  onClick,
  className,
}: ButtonProps, ref: Ref<HTMLButtonElement>) => {
  return (
    <button
      ref={ref} 
      onClick={onClick}
      type="button"
      className={clsx(className, styles.button, colors[color])}
      disabled={disabled}>
      {children}
    </button>
  );
});
