import { Image, Text, View } from "react-native";

export default function AppLogo({
    horizontal = false,
    size = 96,
    title = "Rota do Café",
    subtitle,
    titleClassName = "text-3xl",
    subtitleClassName = "text-sm",
    containerClassName = "",
}) {
    return (
        <View
            className={`${horizontal ? "flex-row items-center" : "items-center"} ${containerClassName}`.trim()}
        >
            <Image
                source={require("../../../assets/icon.png")}
                style={{ width: size, height: size }}
                resizeMode="contain"
            />

            {(title || subtitle) && (
                <View className={horizontal ? "ml-3" : "mt-3 items-center"}>
                    {title ? (
                        <Text className={`font-bold text-white ${titleClassName}`}>
                            {title}
                        </Text>
                    ) : null}

                    {subtitle ? (
                        <Text className={`text-gray-300 mt-1 ${subtitleClassName}`}>
                            {subtitle}
                        </Text>
                    ) : null}
                </View>
            )}
        </View>
    );
}