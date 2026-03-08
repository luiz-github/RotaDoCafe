import React from "react";
import { TouchableOpacity, Text } from "react-native";
import styles from "./styles";

export default function Button({
  title,
  onPress,
  style,
  textStyle,
  variant = "primary"
}) {

  const variantStyle = buttonVariants[variant] || buttonVariants.primary;

  return (
    <TouchableOpacity
      style={[styles.button, variantStyle.button, style]}
      onPress={onPress}
    >
      <Text style={[styles.text, variantStyle.text, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const buttonVariants = {
  primary: {
    button: styles.primaryButton,
    text: styles.primaryText
  },
  secondary: {
    button: styles.secondaryButton,
    text: styles.secondaryText
  },
  danger: {
    button: styles.dangerButton,
    text: styles.dangerText
  }
};