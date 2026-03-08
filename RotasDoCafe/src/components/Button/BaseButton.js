import React from "react";
import { TouchableOpacity, Text } from "react-native";
import styles from "./styles";

export default function BaseButton({ title, onPress, style, textStyle }) {

  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );

}
