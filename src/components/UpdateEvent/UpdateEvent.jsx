import React, { useEffect } from 'react'
import Usefetch from '../Customhook/Usefetch'
import { useState } from 'react'
import './UpdateEvent.css'

const UpdateEvent = () => {
  const { loading, data, fetchdata, error } = Usefetch()
  const [selectedEvent, setSelectedevent] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    Number_of_attendees: '',
    description: ''
  })
  const [imageFile, setImageFile] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const endpoint = '/api/v1/eventos'
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
  const handleSelectEvent = (event) => {
    setSelectedevent(event)
    setFormData({
      title: event.title,
      date: event.date.split('T')[0],
      Number_of_attendees: event.Number_of_attendees,
      description: event.description
    })
  }
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0])
  }
  const handleUpdate = async () => {
    if (!selectedEvent) return

    setIsUpdating(true)
    const updateEndpoint = `/api/v1/eventos/${selectedEvent._id}`
    const formDataToSend = new FormData()
    formDataToSend.append('title', formData.title)
    formDataToSend.append('date', formData.date)
    formDataToSend.append('Number_of_attendees', formData.Number_of_attendees)
    formDataToSend.append('description', formData.description)
    if (imageFile) {
      formDataToSend.append('eventimg', imageFile)
    }
    const updateOptions = {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formDataToSend
    }
    await fetchdata(updateEndpoint, updateOptions)
    if (!error) {
      alert('Event updated successfully!')
      setSelectedevent(null)
      fetchdata(endpoint, options)
    } else {
      alert('Failed to update event')
    }
    setIsUpdating(false)
  }
  return (
    <div className='updateevent'>
      {!isUpdating && (
        <>
          <h1>Update Event</h1>
          {loading && <p>Loading events...</p>}
          {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        </>
      )}
      {!selectedEvent && (
        <div className='event-list'>
          {Array.isArray(data) &&
            data.map((event) => (
              <div key={event._id} className='event-item'>
                <h2>{event.title}</h2>
                <img src={event.eventimg} alt={event.title} width='100' />
                <p>{event.date.split('T')[0]}</p>
                <button onClick={() => handleSelectEvent(event)}>Update</button>
              </div>
            ))}
        </div>
      )}

      {selectedEvent && (
        <div className='event-form'>
          <h2>Editing: {selectedEvent.title}</h2>

          <label>Title:</label>
          <input
            type='text'
            name='title'
            value={formData.title}
            onChange={handleChange}
          />

          <label>Date:</label>
          <input
            type='date'
            name='date'
            value={formData.date}
            onChange={handleChange}
          />

          <label>Attendees:</label>
          <input
            type='number'
            name='Number_of_attendees'
            value={formData.Number_of_attendees}
            onChange={handleChange}
          />

          <label>Description:</label>
          <textarea
            name='description'
            value={formData.description}
            onChange={handleChange}
          />

          <label>Current Image:</label>
          <img src={selectedEvent.eventimg} alt='Event' width='150' />

          <label>Upload New Image (Optional):</label>
          <input type='file' accept='image/*' onChange={handleFileChange} />

          <button onClick={handleUpdate} disabled={isUpdating}>
            {isUpdating ? 'Updating...' : 'Update Event'}
          </button>
          <button onClick={() => setSelectedevent(null)} disabled={isUpdating}>
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}

export default UpdateEvent
