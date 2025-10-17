import React, { useState, useCallback } from 'react'
const Base_url = 'https://proyecto13-jgl9.vercel.app'
const Usefetch = () => {
  const [data, setdata] = useState(null)
  const [error, seterror] = useState(null)
  const [loading, setloading] = useState(null)
  const fetchdata = useCallback(async (endpoint, options) => {
    const url = `${Base_url}${endpoint}`
    setloading(true)
    seterror(null)
    try {
      const res = await fetch(url, options)
      console.log('raw response', res)
      if (!res.ok) {
        const errData = await res.text().catch(() => null)
        console.error('API Error Details:', errData)
        throw new Error(errData.message || `Error: ${res.status}`)
      }
      const result = await res.json()
      setdata(result)
    } catch (error) {
      seterror(error.message)
    } finally {
      setloading(false)
    }
  }, [])
  return { data, error, loading, fetchdata }
}

export default Usefetch
