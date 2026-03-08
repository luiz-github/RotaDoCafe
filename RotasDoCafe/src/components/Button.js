import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'

const buttonVariants = {
  primary: {
    button: styles.primaryButton,
    text: styles.primaryText,
  },
  secondary: {
    button: styles.secondaryButton,
    text: styles.secondaryText,
  },
  danger: {
    button: styles.dangerButton,
    text: styles.dangerText,
  },
}

export default function Button({ title, onPress, style, textStyle, variant = 'primary' }) {
  
  const variantStyle = buttonVariants[variant] || buttonVariants.primary

  return (
    <TouchableOpacity
      style={[styles.button, variantStyle.button, style]}
      onPress={onPress}
    >
      <Text style={[styles.text, variantStyle.text, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryButton: {
    backgroundColor: '#FFF',
  },

  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: '#FFF',
  },

  dangerButton: {
    backgroundColor: '#FF6B6B',
  },

  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  primaryText: {
    color: '#6F4E37',
  },

  secondaryText: {
    color: '#FFF',
  },

  dangerText: {
    color: '#FFF',
  },
})