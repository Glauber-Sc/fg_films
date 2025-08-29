"use client"

import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import PageHeader from "../components/PageHeader"
import Card from "../components/Card"
import ProductForm from "../components/ProductForm"
import { createProduct } from "../services/api"

const AddProduct = () => {
  const navigate = useNavigate()

  const handleSubmit = async (formData) => {
    try {
      await createProduct(formData)
      toast.success("Produto adicionado com sucesso")
      navigate("/products")
    } catch (error) {
      console.error("Error creating product:", error)
      toast.error("Erro ao adicionar produto")
    }
  }

  return (
    <div>
      <PageHeader title="Adicionar Produto" />

      <Card>
        <ProductForm onSubmit={handleSubmit} buttonText="Adicionar Produto" />
      </Card>
    </div>
  )
}

export default AddProduct
