import { getApp, getApps, initializeApp } from 'firebase/app'
import { firebaseConfig } from './config'

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)

export { app }
