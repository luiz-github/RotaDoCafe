import { useEffect, useState } from 'react'
import { getCurrentUserRole } from '../../services/users/userService'

export const useUserRole = () => {
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const currentRole = await getCurrentUserRole()
        setRole(currentRole)
      } catch (error) {
        console.error('Erro ao buscar role do usuário:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchRole()
  }, [])

  return { role, loading }
}
