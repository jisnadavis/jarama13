import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Usefetch from '../Customhook/Usefetch'
import './Createproduct.css'

const Createproduct = () => {
  const categories = [
    'salsa',
    'verdura',
    'pescado',
    'limpieza',
    'carne',
    'cafe',
    'bebida',
    'cerveza',
    'vino',
    'whisky',
    'gin',
    'agua',
    'zumo',
    'tonico'
  ]
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const [showform, setShowform] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { loading, error, fetchdata, data } = Usefetch()
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowform(true)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])
  const submitForm = async (formdata) => {
    const date = new Date(formdata.fecha_de_caducidad)

    if (isNaN(date.getTime())) {
      console.error('Invalid date format')
      return
    }

    const formattedDate = date.toISOString().split('T')[0]

    const payload = {
      name_of_the_products: formdata.name_of_the_products,
      fecha_de_caducidad: formattedDate,
      categoria: formdata.categoria,
      stock: Number(formdata.stock),
      provedor: formdata.provedor
    }

    console.log('Submitting payload:', payload)

    const endpoint = '/api/v1/products/'
    const token = localStorage.getItem('token')

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    }

    setIsSubmitting(true)
    fetchdata(endpoint, options)
  }

  useEffect(() => {
    if (!loading && isSubmitting) {
      setIsSubmitting(false)
    }
  }, [loading, isSubmitting])
  const errorMessage =
    error === 'Error: 400'
      ? 'Invalid date format. Unable to create the product.'
      : error === 'Error: 403'
      ? 'You are not authorized to create the product.'
      : 'An unknown error occurred.'

  return (
    <div className='createproduct'>
      {(!showform || isSubmitting) && (
        <img
          className='loading_img'
          src='https://thoughtsonprogramming.wordpress.com/wp-content/uploads/2018/11/spinner.gif'
          alt='loading'
        />
      )}
      {showform && !isSubmitting && !data && !error && (
        <form onSubmit={handleSubmit(submitForm)} className='productcreateform'>
          <label htmlFor='name_of_the_products'>
            Enter the name of the product
          </label>
          <input
            type='text'
            id='name_of_the_products'
            {...register('name_of_the_products', {
              required: 'Introduce the name_of_the_products'
            })}
          />
          {errors.name_of_the_products && (
            <p style={{ color: 'red' }}>
              {errors.name_of_the_products.message}
            </p>
          )}

          <label htmlFor='fecha_de_caducidad'>Please select the date</label>
          <input
            type='date'
            id='fecha_de_caducidad'
            min={today}
            {...register('fecha_de_caducidad', {
              required: 'Please select a valid date'
            })}
          />
          {errors.fecha_de_caducidad && (
            <p style={{ color: 'red' }}>{errors.fecha_de_caducidad.message}</p>
          )}

          <label htmlFor='categoria'>Enter the categoria</label>
          <select
            id='categoria'
            {...register('categoria', {
              required: 'Please select a category'
            })}
          >
            <option value=''>-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
          {errors.categoria && (
            <p style={{ color: 'red' }}>{errors.categoria.message}</p>
          )}

          <label htmlFor='stock'>Enter the stock</label>
          <input
            type='number'
            id='description'
            {...register('stock', {
              required: 'Introduce the stock'
            })}
          />
          {errors.stock && (
            <p style={{ color: 'red' }}>{errors.stock.message}</p>
          )}

          <label htmlFor='provedor'>Enter the provedor</label>
          <input
            type='text'
            id='provedor'
            {...register('provedor', {
              required: 'Introduce the provedor'
            })}
          />
          {errors.provedor && (
            <p style={{ color: 'red' }}>{errors.provedor.message}</p>
          )}

          <button type='submit' className='general' disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      )}
      {data && (
        <div className='success'>
          <p>You successfully created the product, {data.title}.</p>
          <button
            onClick={() => {
              setShowform(true)
              setIsSubmitting(false)
              window.location.reload()
            }}
            className='goback'
          >
            Go back
          </button>
        </div>
      )}

      {error && (
        <div className='registererror'>
          <p style={{ color: 'red' }}>{errorMessage}</p>
          <button
            onClick={() => {
              setShowform(true)
              setIsSubmitting(false)
              window.location.reload()
            }}
            className='goback'
          >
            Go back
          </button>
        </div>
      )}
    </div>
  )
}

export default Createproduct
