import React, { useEffect, useState } from 'react'
import Usefetch from '../Customhook/Usefetch'
import './CalculateExtra.css'

const CalculateExtra = () => {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [totalHours, setTotalHours] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const today = new Date().toISOString().split('T')[0]
  const staff = JSON.parse(localStorage.getItem('staff'))
  const staffId = staff?._id || ''

  console.log('🆔 Staff ID:', staffId)

  const { data, error, loading, fetchdata } = Usefetch()

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowForm(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (staffId) {
      fetchdata(`/api/v1/extrahour/${staffId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
    }
  }, [staffId])

  const handleCalculateTotalHours = () => {
    if (!startDate || !endDate || !data?.extraHours) return

    const start = new Date(startDate).getTime()
    const end = new Date(endDate).getTime()

    const filteredHours = data.extraHours
      .filter((extra) => {
        const extraDate = new Date(extra.fecha).getTime()
        return extraDate >= start && extraDate <= end
      })
      .reduce((sum, extra) => sum + extra.hours, 0)

    setTotalHours(filteredHours)
  }

  const errorMessage =
    error === 'Error: 404'
      ? 'No extra hours record found.'
      : error === 'Error: 403'
      ? 'You are not authorized to see the extra hours.'
      : error
      ? 'An unknown error occurred.'
      : ''

  return (
    <div className='selectdate_calculateextra'>
      {loading && !showForm ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className='calculate'>
            <h2>Calculate Extra Hours</h2>

            <div className='date-filters'>
              <label>
                Select a Start Date:
                <input
                  type='date'
                  value={startDate}
                  max={today}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </label>

              <label>
                Select an End Date:
                <input
                  type='date'
                  value={endDate}
                  max={today}
                  min={startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </label>

              <button
                className='general'
                onClick={handleCalculateTotalHours}
                disabled={!startDate || !endDate}
              >
                Calculate Extra Hours
              </button>
              {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
              {!loading && totalHours !== null && (
                <h3>Total Extra Hours: {totalHours}</h3>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default CalculateExtra
