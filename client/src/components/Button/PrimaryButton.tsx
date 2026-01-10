import classNames from "classnames";
import { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./PrimaryButton.module.css";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "medium" | "large";
  isLoading?: boolean;
}

export default function PrimaryButton({
  children,
  variant = "primary",
  size = "medium",
  isLoading = false,
  disabled,
  className,
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      type="button"
      className={classNames(styles.button, styles[variant], styles[size], className, {
        [styles.loading]: isLoading,
      })}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading && <span className={styles.spinner} aria-hidden="true" />}
      <span className={isLoading ? styles.hidden : ""}>{children}</span>
    </button>
  );
}

