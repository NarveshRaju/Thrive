import React from "react";
import styles from "./PrimaryButton.module.css";

const PrimaryButton = ({ children, variant = "amber", ...rest }) => {
  const variantClass =
    variant === "amber"
      ? styles.amber
      : variant === "cyan"
      ? styles.cyan
      : variant === "purple"
      ? styles.purple
      : styles.default;

  return (
    <button className={`${styles.button} ${variantClass}`} {...rest}>
      {children}
    </button>
  );
};

export default PrimaryButton;
