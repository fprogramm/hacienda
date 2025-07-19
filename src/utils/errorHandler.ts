import { Alert } from 'react-native';

export interface AppError {
  code: string;
  message: string;
  details?: string;
}

export class ErrorHandler {
  static showError(error: AppError | Error | string): void {
    let title = 'Error';
    let message = 'Ha ocurrido un error inesperado';

    if (typeof error === 'string') {
      message = error;
    } else if (error instanceof Error) {
      message = error.message;
    } else {
      title = error.code;
      message = error.message;
    }

    Alert.alert(title, message, [{ text: 'OK' }]);
  }

  static showSuccess(message: string): void {
    Alert.alert('Éxito', message, [{ text: 'OK' }]);
  }

  static showWarning(message: string): void {
    Alert.alert('Advertencia', message, [{ text: 'OK' }]);
  }

  static showConfirmation(
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ): void {
    Alert.alert(
      'Confirmación',
      message,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
          onPress: onCancel,
        },
        {
          text: 'Confirmar',
          onPress: onConfirm,
        },
      ]
    );
  }

  static logError(error: Error | string, context?: string): void {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const logMessage = context 
      ? `[${context}] ${errorMessage}` 
      : errorMessage;
    
    console.error(logMessage);
    
    // En producción, aquí podrías enviar el error a un servicio de logging
    // como Sentry, Crashlytics, etc.
  }
}

// Errores predefinidos
export const AppErrors = {
  NETWORK_ERROR: {
    code: 'NETWORK_ERROR',
    message: 'Error de conexión. Verifique su conexión a internet.',
  },
  INVALID_CREDENTIALS: {
    code: 'INVALID_CREDENTIALS',
    message: 'Usuario o contraseña incorrectos.',
  },
  SESSION_EXPIRED: {
    code: 'SESSION_EXPIRED',
    message: 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.',
  },
  VALIDATION_ERROR: {
    code: 'VALIDATION_ERROR',
    message: 'Por favor, verifique los datos ingresados.',
  },
  SERVER_ERROR: {
    code: 'SERVER_ERROR',
    message: 'Error del servidor. Intente nuevamente más tarde.',
  },
};
