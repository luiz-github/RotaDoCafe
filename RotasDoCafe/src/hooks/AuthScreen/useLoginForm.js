import { useState } from 'react'

export default function useLoginForm(initialEmail = '') {
  const [email, setEmail] = useState(initialEmail)
  const [password, setPassword] = useState('')

  return {
    email,
    password,
    setEmail,
    setPassword,
  }
}
