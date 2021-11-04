import clsx from 'clsx';
import React, { MouseEvent } from 'react';

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
  className?: string
}

export const Button: React.FC<ButtonProps> = ({
  children,
  disabled,
  color = 'green',
  onClick,
  className,
}) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className={clsx(className, styles.button, colors[color])}
      disabled={disabled}>
      {children}
    </button>
  );
};
