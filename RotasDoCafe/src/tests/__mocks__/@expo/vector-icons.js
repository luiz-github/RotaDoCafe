import React from 'react'
import { Text } from 'react-native'

const Ionicons = ({ name, size, color, ...props }) => (
  <Text {...props}>{name}</Text>
)

module.exports = { Ionicons }
