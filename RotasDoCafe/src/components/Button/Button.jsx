import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, View } from "react-native";

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
  variant = "primary",
  loading = false,
  disabled = false
}) {

  const variantStyle = variants[variant] || variants.primary;
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      className={`py-4 px-8 rounded-full flex-row items-center justify-center 
        ${variantStyle.button} 
        ${isDisabled ? "opacity-50" : ""}
      `}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading && (
        <ActivityIndicator size="small" color="#000" style={{ marginRight: 8 }} />
      )}

      <Text className={`text-lg font-bold ${variantStyle.text}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}