import { useEffect, useState } from 'react'

export const useClipboardSupport = () => {
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    const supported = typeof navigator !== 'undefined' &&
      Boolean(navigator.clipboard) &&
      'write' in navigator.clipboard &&
      typeof ClipboardItem !== 'undefined'

    setIsSupported(supported)
  }, [])

  return isSupported
}
