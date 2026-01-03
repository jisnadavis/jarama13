import React, { useEffect, useState } from 'react'
import Usefetch from '../Customhook/Usefetch'
import './Createhorario.css'

const Createhorario = () => {
  const { loading, data, fetchdata, error } = Usefetch()

  const [selectedStaff, setSelectedStaff] = useState(null)
  const [startDate, setStartDate] = useState('')
  const [horarioData, setHorarioData] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const staffEndpoint = '/api/v1/staffs'
  const horarioEndpoint = '/api/v1/horario/'
  const token = localStorage.getItem('token')

  const staffOptions = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  useEffect(() => {
    fetchdata(staffEndpoint, staffOptions)
  }, [])

  const formatDate = (date, daysToAdd = 0) => {
    if (!date) return ''
    const d = new Date(date)
    d.setDate(d.getDate() + daysToAdd)

    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')

    return `${yyyy}-${mm}-${dd}`
  }

  useEffect(() => {
    if (startDate && selectedStaff) {
      const newHorario = Array.from({ length: 7 }, (_, i) => ({
        fecha: formatDate(startDate, i),
        lugar: '',
        Time: '',
        status: 'on_duty',
        name_of_the_staff: selectedStaff._id
      }))
      setHorarioData(newHorario)
    }
  }, [startDate, selectedStaff])

  const handleSelect = (staff) => {
    setSelectedStaff(staff)
  }

  const handleChange = (index, field, value) => {
    const updatedHorario = [...horarioData]

    if (field === 'status') {
      updatedHorario[index].status = value

      if (value === 'leave' || value === 'baja' || value === 'vacaciones') {
        updatedHorario[index].lugar = 'N/A'
        updatedHorario[index].Time = 'N/A'
      } else {
        updatedHorario[index].lugar = ''
        updatedHorario[index].Time = ''
      }
    } else {
      updatedHorario[index][field] = value
    }

    setHorarioData(updatedHorario)
  }

  const resetForm = () => {
    setSelectedStaff(null)
    setStartDate('')
    setHorarioData([])
  }

  const handleSubmit = async () => {
    if (!selectedStaff || !startDate) {
      alert('Please select staff and start date')
      return
    }

    setIsSubmitting(true)

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(horarioData)
    }

    try {
      await fetchdata(horarioEndpoint, options)

      if (error) {
        alert(`Failed to create horario: ${error}`)
      } else {
        alert('Horario created successfully ✅')

        resetForm()
        fetchdata(staffEndpoint, staffOptions)
      }
    } catch {
      alert('Something went wrong')
    }

    setIsSubmitting(false)
  }

  return (
    <div className='create-horario'>
      <h1>Create Schedule</h1>

      {!selectedStaff ? (
        <>
          <h2>Select Staff</h2>

          {loading && <p className='load'>Loading staff...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <div className='staff-list'>
            {Array.isArray(data) &&
              data.map((staff) => (
                <div
                  key={staff._id}
                  className='staff-item'
                  onClick={() => handleSelect(staff)}
                >
                  <h3>
                    {staff.name} {staff.apellidos}
                  </h3>
                </div>
              ))}
          </div>
        </>
      ) : (
        <>
          <div className='selected-staff'>
            <button onClick={resetForm}>⬅ Go Back</button>
            <h2>
              Selected Staff: {selectedStaff.name} {selectedStaff.apellidos}
            </h2>
          </div>

          <h2>Select Start Date</h2>
          <input
            type='date'
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          {startDate && (
            <div className='horario-preview'>
              <h2>Horario for {selectedStaff.name}</h2>

              <div className='horario-forms'>
                {horarioData.map((day, index) => (
                  <div key={index} className='horario-item'>
                    <h3>{day.fecha}</h3>

                    <label>Location</label>
                    <input
                      type='text'
                      value={day.lugar}
                      onChange={(e) =>
                        handleChange(index, 'lugar', e.target.value)
                      }
                      disabled={day.status !== 'on_duty'}
                    />

                    <label>Time</label>
                    <input
                      type='text'
                      value={day.Time}
                      onChange={(e) =>
                        handleChange(index, 'Time', e.target.value)
                      }
                      disabled={day.status !== 'on_duty'}
                    />

                    <label>Status</label>
                    <select
                      value={day.status}
                      onChange={(e) =>
                        handleChange(index, 'status', e.target.value)
                      }
                    >
                      <option value='on_duty'>On Duty</option>
                      <option value='leave'>Leave</option>
                      <option value='baja'>Baja</option>
                      <option value='vacaciones'>Vacaciones</option>
                      <option value='extra'>Extra</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {horarioData.length > 0 && (
            <button
              className='create-horario-button'
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Create Schedule'}
            </button>
          )}
        </>
      )}
    </div>
  )
}

export default Createhorario
