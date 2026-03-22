import Toast from 'react-native-toast-message';

export default function useToast() {
    const showSuccess = (message) => {
        Toast.show({
            type: 'success',
            text1: 'Sucesso',
            text2: message,
        });
    };

    const showError = (message) => {
        Toast.show({
            type: 'error',
            text1: 'Erro',
            text2: message,
        });
    };

    const showInfo = (message) => {
        Toast.show({
            type: 'info',
            text1: 'Aviso',
            text2: message,
        });
    };

    return { showSuccess, showError, showInfo };
}