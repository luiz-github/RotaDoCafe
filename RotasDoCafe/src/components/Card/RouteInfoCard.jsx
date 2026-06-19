import { View, Text, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export default function RouteInfoCard({ route, selectedIndex, onSelect, onClose }) {
  if (!route) return null

  return (
    <View
      testID="route-info-card"
      className="
        absolute bottom-6 left-4 right-4
        bg-white rounded-3xl p-4 z-50
      "
    >
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-lg font-bold">
          {route.icon} {route.title}
        </Text>

        <Pressable
          testID="route-info-close"
          onPress={onClose}
          className="w-8 h-8 items-center justify-center rounded-full bg-gray-200"
        >
          <Ionicons name="close" size={18} color="#374151" />
        </Pressable>
      </View>

      {route.places.map((place, index) => {
        const selected = selectedIndex === index

        return (
          <Pressable
            key={index}
            testID={`route-point-${index}`}
            onPress={() => onSelect(index)}
          >
            <Text
              className="mb-2 font-medium"
              style={{
                color: place.isUser
                  ? '#228dff'
                  : selected
                    ? '#22c55e'
                    : '#d4a017',
              }}
            >
              {place.isUser ? '🔵' : selected ? '🟢' : '🟡'}{' '}
              {index + 1}. {place.name}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}
