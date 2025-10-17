import React, { useEffect, useState } from 'react'
import Usefetch from '../Customhook/Usefetch'

const Deletestaff = () => {
  const { loading, data, fetchdata, error } = Usefetch()
  const [isDeleting, setIsDeleting] = useState(false)
  const [staffList, setStaffList] = useState([])

  const endpoint = '/api/v1/staffs'
  const token = localStorage.getItem('token')

  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  // Fetch staff list on mount
  useEffect(() => {
    fetchStaff()
  }, [])

  useEffect(() => {
    if (Array.isArray(data)) {
      setStaffList(data)
    }
  }, [data])

  const fetchStaff = async () => {
    await fetchdata(endpoint, options)
  }

  const handleDelete = async (staffId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this staff member?'
    )
    if (!confirmDelete) return

    setIsDeleting(true)

    // Use fetchdata hook for DELETE
    await fetchdata(`/api/v1/staffs/${staffId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    // After DELETE completes, refetch staff or update local state
    if (!error) {
      alert('Staff deleted successfully!')
      // Remove deleted staff from local state
      setStaffList((prev) => prev.filter((staff) => staff._id !== staffId))
    } else {
      alert('Failed to delete staff')
    }

    setIsDeleting(false)
  }

  return (
    <div className='delete-staff'>
      <h1>Delete Staff</h1>

      {loading && <p>Loading staff...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {!loading && !error && (
        <div className='staff-list'>
          {staffList.map((staff) => (
            <div key={staff._id} className='staff-item'>
              <h2>
                {staff.name} {staff.apellidos}
              </h2>
              <button
                onClick={() => handleDelete(staff._id)}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Deletestaff
