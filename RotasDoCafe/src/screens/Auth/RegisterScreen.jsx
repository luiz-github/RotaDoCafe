import { useMemo, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/Button/Button";
import Loading from "../../components/Loading/Loading";
import useRegister from "../../hooks/AuthScreen/useRegister";
import { validateRegisterForm } from "../../services/validations/registerValidation";

export default function RegisterScreen({ navigation }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showValidationErrors, setShowValidationErrors] = useState(false);

    const { handleRegister, loading } = useRegister(navigation);

    const formValidation = useMemo(
        () => validateRegisterForm({ username, email, password, confirmPassword }),
        [username, email, password, confirmPassword]
    );

    const hasAllFieldsFilled = useMemo(
        () => [username, email, password, confirmPassword].every((field) => field.trim().length > 0),
        [username, email, password, confirmPassword]
    );

    return (
        <SafeAreaView className="flex-1 bg-coffee">
            <StatusBar barStyle="light-content" />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 140 : 120}
                className="flex-1"
            >
                <Loading visible={loading} text="Criando conta..." />

                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        paddingBottom: 120

                    }}
                    keyboardShouldPersistTaps="handled"
                >

                    <View className="flex-1 px-6 pt-10">

                        <View className="items-center mb-10">
                            <Text className="text-3xl font-bold text-white">
                                Criar conta
                            </Text>
                            <Text className="text-gray-300 mt-2">
                                Comece sua jornada ☕
                            </Text>
                        </View>

                        <View className="bg-white/10 p-6 rounded-xl">

                            <Text className="text-white mb-2">Usuário</Text>
                            <TextInput
                                value={username}
                                onChangeText={setUsername}
                                placeholder="Digite seu usuário"
                                placeholderTextColor="#ccc"
                                className="bg-white rounded-lg px-4 py-3 mb-4"
                            />
                            {showValidationErrors && formValidation.errors.username && (
                                <Text className="text-red-300 text-sm -mt-2 mb-3">
                                    {formValidation.errors.username}
                                </Text>
                            )}
                            <Text className="text-white mb-2">E-mail</Text>
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                placeholder="Digite seu e-mail"
                                placeholderTextColor="#ccc"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                className="bg-white rounded-lg px-4 py-3 mb-4"
                            />
                            {showValidationErrors && formValidation.errors.email && (
                                <Text className="text-red-300 text-sm -mt-2 mb-3">
                                    {formValidation.errors.email}
                                </Text>
                            )}

                            <Text className="text-white mb-2">Senha</Text>
                            <View className="relative mb-4">
                                <TextInput
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder="Digite sua senha"
                                    placeholderTextColor="#ccc"
                                    secureTextEntry={!showPassword}
                                    className="bg-white rounded-lg px-4 py-3 pr-12"
                                />

                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: "absolute",
                                        right: 8,
                                        top: "50%",
                                        transform: [{ translateY: -10 }]
                                    }}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <Text>{showPassword ? "🙈" : "👁️"}</Text>
                                </TouchableOpacity>
                            </View>
                            {showValidationErrors && formValidation.errors.password && (
                                <Text className="text-red-300 text-sm -mt-2 mb-3">
                                    {formValidation.errors.password}
                                </Text>
                            )}

                            <Text className="text-white mb-2">Confirmar senha</Text>
                            <View className="relative mb-6">
                                <TextInput
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    placeholder="Confirme sua senha"
                                    placeholderTextColor="#ccc"
                                    secureTextEntry={!showConfirm}
                                    className="bg-white rounded-lg px-4 py-3 pr-12"
                                />

                                <TouchableOpacity
                                    onPress={() => setShowConfirm(!showConfirm)}
                                    style={{
                                        position: "absolute",
                                        right: 8,
                                        top: "50%",
                                        transform: [{ translateY: -10 }]
                                    }}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <Text>{showConfirm ? "🙈" : "👁️"}</Text>
                                </TouchableOpacity>
                            </View>
                            {showValidationErrors && formValidation.errors.confirmPassword && (
                                <Text className="text-red-300 text-sm -mt-4 mb-3">
                                    {formValidation.errors.confirmPassword}
                                </Text>
                            )}
                            <Button
                                testID="register-submit-button"
                                title="Criar conta"
                                onPress={() => {
                                    setShowValidationErrors(true);
                                    handleRegister({ username, email, password, confirmPassword });
                                }}
                                disabled={loading || !hasAllFieldsFilled}
                            />

                            <TouchableOpacity
                                onPress={() => navigation.goBack()}
                                className="mt-4 items-center"
                            >
                                <Text className="text-gray-300">
                                    Já tem conta?{" "}
                                    <Text className="text-white font-semibold">Entrar</Text>
                                </Text>
                            </TouchableOpacity>

                        </View>

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}