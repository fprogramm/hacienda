import { FormErrors, LoginCredentials } from '../types';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateCedula = (cedula: string): boolean => {
  // Validación básica para cédula colombiana
  const cedulaRegex = /^\d{6,10}$/;
  return cedulaRegex.test(cedula);
};

export const validateNIT = (nit: string): boolean => {
  // Validación básica para NIT colombiano
  const nitRegex = /^\d{9,10}-?\d$/;
  return nitRegex.test(nit);
};

export const validateLoginForm = (credentials: LoginCredentials): FormErrors => {
  const errors: FormErrors = {};

  if (!credentials.usuario.trim()) {
    errors.usuario = 'El usuario es requerido';
  } else if (credentials.usuario.length < 6) {
    errors.usuario = 'El usuario debe tener al menos 6 caracteres';
  }

  if (!credentials.contraseña.trim()) {
    errors.contraseña = 'La contraseña es requerida';
  } else if (credentials.contraseña.length < 6) {
    errors.contraseña = 'La contraseña debe tener al menos 6 caracteres';
  }

  return errors;
};

export const validateMatricula = (matricula: string): boolean => {
  // Validación básica para matrícula predial
  const matriculaRegex = /^\d{10,20}$/;
  return matriculaRegex.test(matricula);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
