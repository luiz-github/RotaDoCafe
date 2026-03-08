import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'

export default function Button({ title, onPress, style, textStyle, variant = 'primary' }) {
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryButton
      case 'secondary':
        return styles.secondaryButton
      case 'danger':
        return styles.dangerButton
      default:
        return styles.primaryButton
    }
  }

  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryText
      case 'secondary':
        return styles.secondaryText
      case 'danger':
        return styles.dangerText
      default:
        return styles.primaryText
    }
  }

  return (
    <TouchableOpacity style={[styles.button, getButtonStyle(), style]} onPress={onPress}>
      <Text style={[styles.text, getTextStyle(), textStyle]}>{title}</Text>
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
