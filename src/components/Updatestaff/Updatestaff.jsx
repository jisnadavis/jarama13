import React, { useEffect, useState } from 'react'
import Usefetch from '../Customhook/Usefetch'
import './Updatestaff.css'

const Updatestaff = () => {
  const { loading, data, fetchdata, error } = Usefetch()
  const [selectedstaff, setSelectedstaff] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    apellidos: '',
    email: '',
    NIE: '',
    dirreccion: '',
    role: ''
  })

  const [isUpdating, setIsUpdating] = useState(false)

  const endpoint = '/api/v1/staffs'
  const token = localStorage.getItem('token')

  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  useEffect(() => {
    fetchdata(endpoint, options)
  }, [])

  const handleSelectstaff = (staff) => {
    setSelectedstaff(staff)
    setFormData({
      name: staff.name,
      apellidos: staff.apellidos,
      NIE: staff.NIE,
      email: staff.email,
      dirreccion: staff.dirreccion,
      role: staff.role
    })
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleUpdate = async () => {
    if (!selectedstaff) return

    setIsUpdating(true)

    const updateEndpoint = `/api/v1/staffs/${selectedstaff._id}`

    const updateOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    }

    await fetchdata(updateEndpoint, updateOptions)

    if (!error) {
      alert('Staff updated successfully!')
      setSelectedstaff(null)
      fetchdata(endpoint, options)
    } else {
      alert('Failed to update staff')
    }
    setIsUpdating(false)
  }

  return (
    <div className='update-staff'>
      {!isUpdating && (
        <>
          <h1>Update Staff</h1>
          {loading && <p>Loading staff...</p>}
          {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        </>
      )}

      {!selectedstaff && !loading && (
        <div className='staff-list'>
          {Array.isArray(data) &&
            data.map((staff) => (
              <div key={staff._id} className='staff-item'>
                <h2>
                  {staff.name} {staff.apellidos}
                </h2>
                <button onClick={() => handleSelectstaff(staff)}>Update</button>
              </div>
            ))}
        </div>
      )}

      {selectedstaff && (
        <div className='staff-form'>
          <h2>Editing: {selectedstaff.name}</h2>

          <label>Name:</label>
          <input
            type='text'
            name='name'
            value={formData.name}
            onChange={handleChange}
          />

          <label>Apellidos:</label>
          <input
            type='text'
            name='apellidos'
            value={formData.apellidos}
            onChange={handleChange}
          />

          <label>NIE:</label>
          <input
            type='text'
            name='NIE'
            value={formData.NIE}
            onChange={handleChange}
          />

          <label>Email:</label>
          <input
            type='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
          />

          <label>Dirreccion:</label>
          <input
            type='text'
            name='dirreccion'
            value={formData.dirreccion}
            onChange={handleChange}
          />

          <label>Role:</label>
          <select name='role' value={formData.role} onChange={handleChange}>
            <option value=''>...choose the role</option>
            <option value='jefe de sala'>Jefe de Sala</option>
            <option value='jefe de cocina'>Jefe de Cocina</option>
            <option value='chef ejecutivo'>Chef Ejecutivo</option>
            <option value='administrador'>Administrador</option>
            <option value='ayudante de cocina'>Ayudante de Cocina</option>
            <option value='camarera'>Camarera</option>
            <option value='camarero'>Camarero</option>
            <option value='staff'>Staff</option>
          </select>

          <button onClick={handleUpdate} disabled={isUpdating}>
            {isUpdating ? 'Updating...' : 'Update Staff'}
          </button>
          <button
            onClick={() => setSelectedstaff(null)}
            disabled={isUpdating}
            className='cancelupdatestaff'
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}

export default Updatestaff
