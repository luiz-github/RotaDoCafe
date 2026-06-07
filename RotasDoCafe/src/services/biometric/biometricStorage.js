import * as SecureStore from 'expo-secure-store'

const BIOMETRIC_EMAIL_KEY = process.env.EXPO_PUBLIC_BIOMETRIC_EMAIL_KEY

export function normalizeEmail(email) {
  return (email || '').trim().toLowerCase()
}

export async function saveBiometricEmail(email) {
  const normalizedEmail = normalizeEmail(email)

  if (!normalizedEmail) {
    await SecureStore.deleteItemAsync(BIOMETRIC_EMAIL_KEY)
    return
  }

  await SecureStore.setItemAsync(BIOMETRIC_EMAIL_KEY, normalizedEmail)
}

export async function getBiometricEmail() {
  const savedEmail = await SecureStore.getItemAsync(BIOMETRIC_EMAIL_KEY)
  return normalizeEmail(savedEmail)
}

export async function clearBiometricEmail() {
  await SecureStore.deleteItemAsync(BIOMETRIC_EMAIL_KEY)
}

export async function isBiometricEmailMatch(email) {
  const typedEmail = normalizeEmail(email)

  if (!typedEmail) {
    return false
  }

  const savedEmail = await getBiometricEmail()
  return Boolean(savedEmail && savedEmail === typedEmail)
}

const BIOMETRIC_SECRET_PREFIX = process.env.EXPO_PUBLIC_BIOMETRIC_SECRET_PREFIX

function secretKeyFor(email) {
  return BIOMETRIC_SECRET_PREFIX + normalizeEmail(email).replace(/[^a-zA-Z0-9._-]/g, '_')
}

export async function saveBiometricSecret(email, secret) {
  const key = secretKeyFor(email)
  if (!secret) {
    await SecureStore.deleteItemAsync(key)
    return
  }
  await SecureStore.setItemAsync(key, secret)
}

export async function getBiometricSecret(email) {
  const key = secretKeyFor(email)
  return await SecureStore.getItemAsync(key)
}

export async function clearBiometricSecret(email) {
  const key = secretKeyFor(email)
  await SecureStore.deleteItemAsync(key)
}
