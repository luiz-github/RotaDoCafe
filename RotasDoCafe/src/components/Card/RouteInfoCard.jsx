import { View, Text, Pressable } from 'react-native'

export default function RouteInfoCard({
  route,
  selectedIndex,
  onSelect,
}) {
  if (!route) {
    return null
  }

  return (
    <View
      className="
        absolute
        bottom-6
        left-4
        right-4
        bg-white
        rounded-3xl
        p-4
        z-50
      "
      style={{
        elevation: 8,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 10,
      }}
    >
      <Text className="text-coffee text-lg font-bold mb-3">
        {route.icon} {route.title}
      </Text>

      {route.places.map((place, index) => {
        const isSelected = selectedIndex === index

        return (
          <Pressable
            key={index}
            onPress={() => onSelect(index)}
          >
            <Text
              className="mb-2 font-medium"
              style={{
                color: isSelected
                  ? '#22c55e'
                  : '#d4a017',
              }}
            >
              {isSelected ? '🟢' : '🟡'} {index + 1}. {place.name}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}