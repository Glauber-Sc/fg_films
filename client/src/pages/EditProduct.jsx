// "use client"

// import { useState, useEffect } from "react"
// import { useParams, useNavigate } from "react-router-dom"
// import { toast } from "react-toastify"
// import PageHeader from "../components/PageHeader"
// import Card from "../components/Card"
// import ProductForm from "../components/ProductForm"
// import { fetchProductById, updateProduct } from "../services/api"

// const EditProduct = () => {
//   const { id } = useParams()
//   const navigate = useNavigate()
//   const [product, setProduct] = useState(null)
//   const [isLoading, setIsLoading] = useState(true)

//   useEffect(() => {
//     const loadProduct = async () => {
//       try {
//         const data = await fetchProductById(id)
//         setProduct(data)
//       } catch (error) {
//         console.error("Error loading product:", error)
//         toast.error("Erro ao carregar produto")
//         navigate("/products")
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     loadProduct()
//   }, [id, navigate])

//   const handleSubmit = async (formData) => {
//     try {
//       await updateProduct(id, formData)
//       toast.success("Produto atualizado com sucesso")
//       navigate("/products")
//     } catch (error) {
//       console.error("Error updating product:", error)
//       toast.error("Erro ao atualizar produto")
//     }
//   }

//   if (isLoading) {
//     return <div className="text-center py-4">Carregando...</div>
//   }

//   return (
//     <div>
//       <PageHeader title="Editar Produto" />

//       <Card>
//         {product ? (
//           <ProductForm initialData={product} onSubmit={handleSubmit} buttonText="Atualizar Produto" />
//         ) : (
//           <div className="text-center py-4">Produto não encontrado</div>
//         )}
//       </Card>
//     </div>
//   )
// }

// export default EditProduct



"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import PageHeader from "../components/PageHeader"
import Card from "../components/Card"
import ProductForm from "../components/ProductForm"
import { fetchProductById, updateProduct } from "../services/api"

const EditProduct = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await fetchProductById(id)
        setProduct(data)
      } catch (error) {
        console.error("Error loading product:", error)
        toast.error("Erro ao carregar produto")
        navigate("/products")
      } finally {
        setIsLoading(false)
      }
    }

    loadProduct()
  }, [id, navigate])

  const handleSubmit = async (formData) => {
    try {
      await updateProduct(id, formData)
      toast.success("Produto atualizado com sucesso")
      navigate("/products")
    } catch (error) {
      console.error("Error updating product:", error)
      toast.error("Erro ao atualizar produto")
    }
  }

  if (isLoading) {
    return <div className="text-center py-4">Carregando...</div>
  }

  return (
    <div>
      <PageHeader title="Editar Produto" />

      <Card>
        {product ? (
          <ProductForm initialData={product} onSubmit={handleSubmit} buttonText="Atualizar Produto" />
        ) : (
          <div className="text-center py-4">Produto não encontrado</div>
        )}
      </Card>
    </div>
  )
}

export default EditProduct
