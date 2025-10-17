import React, { useEffect, useState } from 'react'
import Usefetch from '../Customhook/Usefetch'
import './DeleteEvent.css'

const DeleteEvent = () => {
  const { data, fetchdata, loading, error } = Usefetch()
  const [selectedEvent, setSelectedevent] = useState(null)
  const [deletingevent, setdeletingevent] = useState(false)
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
  }
  const handledelete = async () => {
    if (!selectedEvent) return
    setdeletingevent(true)
    const deleteendpoint = `/api/v1/eventos/${selectedEvent._id}`
    const deleteoptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
    await fetchdata(deleteendpoint, deleteoptions)
    if (!error) {
      alert('Event deleted successfully!')
      setSelectedevent(null)
      fetchdata(endpoint, options)
    } else {
      alert('Failed to deleteevnt event')
    }
    setdeletingevent(false)
  }

  return (
    <div className='delete-event-container'>
      {!deletingevent && (
        <>
          <h1>Delete Event</h1>
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
                <button onClick={() => handleSelectEvent(event)}>delete</button>
              </div>
            ))}
        </div>
      )}
      {selectedEvent && (
        <>
          <div className='event-delete-form'>
            <h2>Deleting: {selectedEvent.title}</h2>
            <img src={selectedEvent.eventimg} className='deleteimg' />
            <button onClick={handledelete} disabled={deletingevent}>
              {deletingevent ? 'deleting...' : 'Delete Event'}
            </button>
            <button
              onClick={() => setSelectedevent(null)}
              disabled={deletingevent}
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default DeleteEvent
