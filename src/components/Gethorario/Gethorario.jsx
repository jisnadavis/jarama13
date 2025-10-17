import React, { useState } from 'react'
import './Gethorario.css'

const Gethorario = () => {
  const [selectedDate, setSelectedDate] = useState('')
  const [horarioList, setHorarioList] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const staffs = localStorage.getItem('staff')
  const staff = JSON.parse(staffs)
  const token = localStorage.getItem('token')
  const staffId = staff._id
  console.log(staffId)

  const fetchHorario = async () => {
    if (!selectedDate) {
      setErrorMessage('Please select a date.')
      return
    }

    setLoading(true)
    setErrorMessage('')
    setHorarioList([])

    try {
      const response = await fetch(
        `https://proyecto13-d3i6.vercel.app/api/v1/horario/${staffId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch horario.')
      }

      const selectedDateObj = new Date(selectedDate)
      const next7Days = Array.from({ length: 7 }, (_, i) => {
        const newDate = new Date(selectedDateObj)
        newDate.setDate(selectedDateObj.getDate() + i)
        return newDate.toISOString().split('T')[0]
      })

      const filteredHorario = result.horario.filter((h) =>
        next7Days.includes(h.fecha.split('T')[0])
      )

      // ✅ Remove duplicates: keep last updated
      const uniqueHorarioByDate = Object.values(
        filteredHorario.reduce((acc, current) => {
          const dateKey = current.fecha.split('T')[0]
          if (!acc[dateKey]) {
            acc[dateKey] = current
          } else {
            const currentUpdated = new Date(current.updatedAt || current.fecha)
            const existingUpdated = new Date(
              acc[dateKey].updatedAt || acc[dateKey].fecha
            )
            if (currentUpdated > existingUpdated) {
              acc[dateKey] = current
            }
          }
          return acc
        }, {})
      )

      uniqueHorarioByDate.sort((a, b) => new Date(a.fecha) - new Date(b.fecha))

      if (uniqueHorarioByDate.length === 0) {
        throw new Error('No horario found for the selected week.')
      }

      setHorarioList(uniqueHorarioByDate)
    } catch (err) {
      setErrorMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='horario-container'>
      <h2>Get Horario</h2>

      <label>Select Date:</label>
      <input
        type='date'
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />
      <button onClick={fetchHorario}>Fetch Horario</button>

      {loading && <p>Loading...</p>}

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      {horarioList.length > 0 && (
        <table border='1' cellPadding='10'>
          <thead>
            <tr>
              <th>Date</th>
              <th>Location</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {horarioList.map((h) => (
              <tr
                key={h._id}
                style={{
                  backgroundColor:
                    h.status === 'leave'
                      ? 'lightgreen'
                      : h.status === 'vacaciones' || h.status === 'baja'
                      ? 'lightcoral'
                      : 'white'
                }}
              >
                <td>{new Date(h.fecha).toLocaleDateString()}</td>
                <td>{h.lugar}</td>
                <td>{h.Time}</td>
                <td>{h.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Gethorario
