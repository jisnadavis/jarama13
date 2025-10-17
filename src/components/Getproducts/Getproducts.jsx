import React, { useEffect, useState } from 'react'
import Usefetch from '../Customhook/Usefetch'
import './Getproduct.css'

const Getproducts = () => {
  const { loading, data, fetchdata, error } = Usefetch()
  const [showproducts, setshowproducts] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setshowproducts(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const endpoint = '/api/v1/products'
  const token = localStorage.getItem('token')
  const options = {
    method: 'get',
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  useEffect(() => {
    fetchdata(endpoint, options)
  }, [])

  const errorMessage =
    error === 'Error: 400'
      ? 'Cannot show any products only authorized persons can see the products'
      : 'Unknown error'

  return (
    <div className='product_container'>
      {loading && (
        <div className='loading'>
          <img
            className='loading_img'
            src='https://thoughtsonprogramming.wordpress.com/wp-content/uploads/2018/11/spinner.gif'
            alt='loading'
          />
          <p>Loading products...</p>
        </div>
      )}

      {!loading && showproducts && Array.isArray(data) && (
        <div className='productparticular'>
          {data.map((product) => (
            <div key={product._id} className='productdescription'>
              <h1>{product.name_of_the_products}</h1>
              <h2>
                Expiry:{' '}
                {
                  new Date(product.fecha_de_caducidad)
                    .toISOString()
                    .split('T')[0]
                }
              </h2>
              <h3>Category: {product.categoria}</h3>
              <h3>Provider: {product.provedor}</h3>
              <h3>Stock: {product.stock}</h3>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className='product_error'>
          <p style={{ color: 'red' }}>{errorMessage}</p>
          <button
            onClick={() => (window.location.href = '/')}
            className='goback'
          >
            Go back
          </button>
        </div>
      )}
    </div>
  )
}

export default Getproducts
