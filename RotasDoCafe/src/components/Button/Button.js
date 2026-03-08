import React from "react";
import BaseButton from "./BaseButton";
import styles from "./styles";

function Primary(props){
  return (
    <BaseButton
      {...props}
      style={[styles.primaryButton, props.style]}
      textStyle={[styles.primaryText, props.textStyle]}
    />
  );
}

function Secondary(props) {
  return (
    <BaseButton
      {...props}
      style={[styles.secondaryButton, props.style]}
      textStyle={[styles.secondaryText, props.textStyle]}
    />
  );
}

function Danger(props) {
  return (
    <BaseButton
      {...props}
      style={[styles.dangerButton, props.style]}
      textStyle={[styles.dangerText, props.textStyle]}
    />
  );
}

const Button = {
  Primary,
  Secondary,
  Danger
};

export default Button;