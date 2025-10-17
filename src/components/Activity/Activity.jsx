import React, { useEffect, useState } from 'react'
import CreateEvent from '../CreateEvent/CreateEvent'
import UpdateEvent from '../UpdateEvent/UpdateEvent'
import DeleteEvent from '../DeleteEvent/DeleteEvent'
import ApuntarExtra from '../ApuntarExtra/ApuntarExtra'
import GetExtra from '../GetExtra/GetExtra'
import CalculateExtra from '../CalculateExtra/CalculateExtra'
import Getproducts from '../Getproducts/Getproducts'
import Gethorario from '../Gethorario/Gethorario'
import Updatestaff from '../Updatestaff/Updatestaff'
import Deletestaff from '../Deletestaff/Deletestaff'
import Getproductsbycategory from '../Getproductsbycategory/Getproductsbycategory'
import Createhorario from '../Createhorario/Createhorario'
import Updateproduct from '../Updateproduct/Updateproduct'
import Updatehorario from '../Updatehorario/Updatehorario'
import Deleteproduct from '../Deleteproduct/Deleteproduct'
import Createproduct from '../Createproduct/Createproduct'
import './Activity.css'

const Activity = () => {
  const [staff, setStaff] = useState(() => {
    const savedStaff = localStorage.getItem('staff')
    return savedStaff ? JSON.parse(savedStaff) : { name: '', role: '' }
  })
  const [activeView, setActiveView] = useState('welcome')

  useEffect(() => {
    const savedStaff = localStorage.getItem('staff')
    if (savedStaff) {
      setStaff(JSON.parse(savedStaff))
    } else {
      setStaff({ name: '', role: '' })
    }
  }, [])

  const components = {
    createEvent: <CreateEvent />,
    updateEvent: <UpdateEvent />,
    deleteEvent: <DeleteEvent />,
    apuntarExtra: <ApuntarExtra />,
    getExtra: <GetExtra />,
    calculateExtra: <CalculateExtra />,
    getProducts: <Getproducts />,
    getHorario: <Gethorario />,
    updateStaff: <Updatestaff />,
    deleteStaff: <Deletestaff />,
    getProductsByCategory: <Getproductsbycategory />,
    createHorario: <Createhorario />,
    updateProduct: <Updateproduct />,
    updateHorario: <Updatehorario />,
    deleteProduct: <Deleteproduct />,
    createProduct: <Createproduct />
  }

  const roleActions = {
    'chef ejucutivo': [
      ['Get Products', 'getProducts'],
      ['Products by Category', 'getProductsByCategory'],
      ['Create Product', 'createProduct'],
      ['Update Product', 'updateProduct'],
      ['Delete Product', 'deleteProduct'],
      ['Ver Horario', 'getHorario'],
      ['Create Horario', 'createHorario'],
      ['Get Extra', 'getExtra'],
      ['Apuntar Extra', 'apuntarExtra'],
      ['Update Horario', 'updateHorario'],
      ['Calcula Extra Month', 'calculateExtra']
    ],
    'jefe de sala': [
      ['Ver Horario', 'getHorario'],
      ['Create Horario', 'createHorario'],
      ['Get Extra', 'getExtra'],
      ['Apuntar Extra', 'apuntarExtra'],
      ['Update Horario', 'updateHorario'],
      ['Calcula Extra Month', 'calculateExtra']
    ],
    administrador: [
      ['Get Products', 'getProducts'],
      ['Products by Category', 'getProductsByCategory'],
      ['Update Staff Role', 'updateStaff'],
      ['Delete Staff', 'deleteStaff'],
      ['Get Extra', 'getExtra'],
      ['Apuntar Extra', 'apuntarExtra'],
      ['Calcula Extra Month', 'calculateExtra']
    ],
    'event organizer': [
      ['Create Events', 'createEvent'],
      ['Update Events', 'updateEvent'],
      ['Delete Events', 'deleteEvent'],
      ['Apuntar Extra', 'apuntarExtra'],
      ['Get Extra', 'getExtra'],
      ['Calcula Extra Month', 'calculateExtra']
    ],
    default: [
      ['Ver Horario', 'getHorario'],
      ['Apuntar Extra', 'apuntarExtra'],
      ['Get Extra', 'getExtra'],
      ['Calcula Extra Month', 'calculateExtra'],
      ['Get Products', 'getProducts'],
      ['Get Products by Category', 'getProductsByCategory']
    ]
  }

  const renderButtons = () => {
    const actions =
      roleActions[staff?.role?.toLowerCase()] || roleActions.default
    return (
      <div className='button-container'>
        {actions.map(([label, view]) => (
          <button key={view} onClick={() => setActiveView(view)}>
            {label}
          </button>
        ))}
      </div>
    )
  }

  if (staff === null) {
    return <p>Loading staff info...</p>
  }

  return (
    <div className='activity-container'>
      {activeView && activeView !== 'welcome' ? (
        components[activeView]
      ) : (
        <>
          <h1>
            {staff.name
              ? `Welcome to the Activity Page, ${staff.name}`
              : 'Welcome to the Activity Page'}
          </h1>
          {renderButtons()}
        </>
      )}
    </div>
  )
}

export default Activity
