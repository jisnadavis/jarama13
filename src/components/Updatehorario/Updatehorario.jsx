import React, { useEffect, useState } from 'react'
import Usefetch from '../Customhook/Usefetch'
import './Updatehorario.css'

const Updatehorario = () => {
  const { fetchdata, data, error, loading } = Usefetch()
  const [staffList, setStaffList] = useState([])
  const [selectedStaff, setSelectedStaff] = useState('')
  const [horarioList, setHorarioList] = useState([])
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedHorario, setSelectedHorario] = useState(null)
  const [updatedHorario, setUpdatedHorario] = useState({})
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [showUpdateForm, setShowUpdateForm] = useState(false)

  const token = localStorage.getItem('token')
  const today = new Date().toISOString().split('T')[0]

  const endpoint = '/api/v1/staffs'
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  useEffect(() => {
    fetchdata(endpoint, options)
  }, [fetchdata])

  useEffect(() => {
    if (data && Array.isArray(data)) {
      console.log('Fetched Staff Data:', data)
      setStaffList(data)
    } else if (error) {
      console.error('Error fetching staff:', error)
      setErrorMessage('Failed to fetch staff data.')
    }
  }, [data, error])

  const handleSelectStaff = async (staffId) => {
    setSelectedStaff(staffId)
    setShowUpdateForm(false)
    setSelectedDate('')
    setSelectedHorario(null)
    setUpdatedHorario({})
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

      if (response.ok) {
        const result = await response.json()
        console.log('Horarios fetched:', result.horario)
        setHorarioList(result.horario)
      } else {
        console.error('Error fetching horarios')
        window.alert('no horario found for selected staff!')
      }
    } catch (err) {
      console.error('Error fetching horarios:', err)
    }
  }

  const handleSelectDate = (date) => {
    if (!date) return
    setSuccessMessage('')
    setSelectedDate(date)
    const foundHorario = horarioList.find((h) => h.fecha.split('T')[0] === date)

    if (foundHorario) {
      setSelectedHorario(foundHorario)
      setUpdatedHorario({
        ...foundHorario,
        fecha: foundHorario.fecha.split('T')[0]
      })
      setShowUpdateForm(true)
    } else {
      setSelectedHorario(null)
      setUpdatedHorario({})
      setShowUpdateForm(false)
      setErrorMessage('No horario found for this date.')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setUpdatedHorario({ ...updatedHorario, [name]: value })
  }

  const handleUpdate = async () => {
    if (!selectedHorario) return

    setSuccessMessage('')
    setErrorMessage('')

    try {
      const response = await fetch(
        `https://proyecto13-d3i6.vercel.app/api/v1/horario/${selectedStaff}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(updatedHorario)
        }
      )

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const result = await response.json()
      console.log('Horario updated:', result)

      setSuccessMessage('Horario updated successfully!')

      window.alert('Horario updated successfully!')

      await handleSelectStaff(selectedStaff)
    } catch (err) {
      console.error('Error updating horario:', err)
      setErrorMessage('Failed to update horario. Please try again.')
    }
  }

  return (
    <div className='update-horario-container'>
      <div className='containerselect'>
        <h2>Update Horario</h2>

        <label>Select Staff:</label>
        <select
          onChange={(e) => handleSelectStaff(e.target.value)}
          value={selectedStaff}
        >
          <option value=''>--Choose Staff--</option>
          {staffList.map((staff) => (
            <option key={staff._id} value={staff._id}>
              {staff.name}
            </option>
          ))}
        </select>
      </div>

      {selectedStaff && horarioList.length > 0 && (
        <div className='selectupdate'>
          <h3>Select a Date:</h3>
          <input
            type='date'
            min={today}
            value={selectedDate}
            onChange={(e) => handleSelectDate(e.target.value)}
          />
        </div>
      )}

      {showUpdateForm && selectedHorario && (
        <div className='horarioup'>
          <h3>Update Horario</h3>
          <div className='horario-update-form'>
            <label>Fecha:</label>
            <input
              type='date'
              name='fecha'
              value={updatedHorario.fecha || ''}
              onChange={handleChange}
            />

            <label>Lugar:</label>
            <input
              type='text'
              name='lugar'
              value={updatedHorario.lugar || ''}
              onChange={handleChange}
            />

            <label>Time:</label>
            <input
              type='text'
              name='Time'
              value={updatedHorario.Time || ''}
              onChange={handleChange}
            />

            <label>Status:</label>
            <select
              name='status'
              value={updatedHorario.status || ''}
              onChange={handleChange}
            >
              <option value='on_duty'>On Duty</option>
              <option value='leave'>Leave</option>
              <option value='baja'>Baja</option>
              <option value='vacaciones'>Vacaciones</option>
              <option value='extra'>Extra</option>
            </select>

            <button onClick={handleUpdate} className='general'>
              Update Horario
            </button>
          </div>

          {successMessage && (
            <p className='success-message'>{successMessage}</p>
          )}
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
      )}

      {errorMessage && !showUpdateForm && (
        <p style={{ color: 'red' }}>{errorMessage}</p>
      )}

      {loading && <p>Loading...</p>}
    </div>
  )
}

export default Updatehorario
