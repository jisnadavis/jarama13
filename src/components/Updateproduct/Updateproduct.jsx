import React, { useEffect, useState } from 'react'
import Usefetch from '../Customhook/Usefetch'
import './Updateproduct.css'

const Updateproduct = () => {
  const { data, fetchdata, loading } = Usefetch()
  const [selectedCategory, setSelectedCategory] = useState('')
  const [filteredProducts, setFilteredProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [updatedProduct, setUpdatedProduct] = useState({})
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [showUpdateForm, setShowUpdateForm] = useState(false)
  const [isCategorySelected, setIsCategorySelected] = useState(false)

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
  const today = new Date().toISOString().split('T')[0]
  const token = localStorage.getItem('token')

  const handleSearchClick = async () => {
    if (selectedCategory) {
      try {
        await fetchdata(`/api/v1/products/${selectedCategory}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` }
        })
        setIsCategorySelected(true)
        setErrorMessage('')
      } catch {
        setErrorMessage('Failed to fetch products. Please try again.')
      }
    }
  }

  useEffect(() => {
    setFilteredProducts(Array.isArray(data) ? data : [])
  }, [data])

  const handleProductSelect = (product) => {
    setSelectedProduct(product)
    const formattedProduct = {
      ...product,
      fecha_de_caducidad: product.fecha_de_caducidad
        ? product.fecha_de_caducidad.split('T')[0]
        : ''
    }
    setUpdatedProduct(formattedProduct)
    setShowUpdateForm(true)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (successMessage) {
      setSuccessMessage('')
    }
    if (name === 'fecha_de_caducidad') {
      const formattedDate = new Date(value).toISOString().split('T')[0]
      setUpdatedProduct({ ...updatedProduct, [name]: formattedDate })
    } else {
      setUpdatedProduct({ ...updatedProduct, [name]: value })
    }
  }

  const handleUpdate = async () => {
    if (!selectedProduct) return

    setSuccessMessage('')
    setErrorMessage('')

    try {
      await fetchdata(`/api/v1/products/${selectedProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedProduct)
      })

      setSuccessMessage('Product updated successfully!')

      await fetchdata(`/api/v1/products/${selectedCategory}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      })

      setShowUpdateForm(true)
    } catch {
      setErrorMessage('Failed to update product. Please try again.')
    }
  }

  const handleGoBack = () => {
    setShowUpdateForm(false)
    setSelectedProduct(null)
    setUpdatedProduct({})
    setSuccessMessage('')
    setErrorMessage('')
    setIsCategorySelected(false)
    setFilteredProducts([])
  }

  return (
    <div className='update-product-container'>
      <h2>Update Product</h2>

      {!showUpdateForm && !successMessage && !isCategorySelected && (
        <>
          <label>Select Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value=''>--Choose Category--</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <button onClick={handleSearchClick}>Search</button>

          <button onClick={handleSearchClick}>Search</button>
        </>
      )}

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {loading && !showUpdateForm && <p>Loading products...</p>}

      {filteredProducts.length > 0 && !showUpdateForm && !successMessage && (
        <div className='productupdate '>
          <div className='filter_update'>
            {filteredProducts.map((product) => (
              <button
                key={product._id}
                onClick={() => handleProductSelect(product)}
              >
                {product.name_of_the_products}
              </button>
            ))}
          </div>
        </div>
      )}

      {isCategorySelected && filteredProducts.length === 0 && !loading && (
        <div>
          <p style={{ color: 'red' }}>
            No products found in the selected category.
          </p>
          <button onClick={handleGoBack}>Go Back</button>
        </div>
      )}

      {showUpdateForm && selectedProduct && (
        <div className='updateproductdetail'>
          <h3>Update {selectedProduct.name_of_the_products}</h3>
          <div className='productupdateformm'>
            <label>Name:</label>
            <input
              type='text'
              name='name_of_the_products'
              value={updatedProduct.name_of_the_products || ''}
              onChange={handleChange}
            />

            <label>Category:</label>
            <input
              type='text'
              name='categoria'
              value={updatedProduct.categoria || ''}
              onChange={handleChange}
            />

            <label>Expiry Date:</label>
            <input
              type='date'
              name='fecha_de_caducidad'
              min={today}
              value={updatedProduct.fecha_de_caducidad || ''}
              onChange={handleChange}
            />

            <label>Stock:</label>
            <input
              type='number'
              name='stock'
              min={0}
              value={updatedProduct.stock || ''}
              onChange={handleChange}
            />

            <label>Provider:</label>
            <input
              type='text'
              name='provedor'
              value={updatedProduct.provedor || ''}
              onChange={handleChange}
            />

            <button onClick={handleUpdate} className='general'>
              Update Product
            </button>
          </div>
          {successMessage && (
            <p className='suessmessage'>product updated sucessfully</p>
          )}
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

          <button onClick={handleGoBack} className='general' id='gobackbu'>
            Go Back
          </button>
        </div>
      )}
    </div>
  )
}
export default Updateproduct
