import React from "react";
import { TouchableOpacity, Text } from "react-native";

const variants = {
  primary: {
    button: "bg-white",
    text: "text-coffee"
  },
  secondary: {
    button: "bg-white/20 border-2 border-white",
    text: "text-white"
  },
  danger: {
    button: "bg-red-400",
    text: "text-white"
  }
};

export default function Button({
  title,
  onPress,
  variant = "primary"
}) {

  const variantStyle = variants[variant] || variants.primary;

  return (
    <TouchableOpacity
      className={`py-4 px-8 rounded-full items-center justify-center ${variantStyle.button}`}
      onPress={onPress}
    >
      <Text
        className={`text-lg font-bold ${variantStyle.text}`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}