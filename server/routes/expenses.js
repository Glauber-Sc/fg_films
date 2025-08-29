import express from "express"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import fs from "fs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const router = express.Router()
const expensesPath = join(__dirname, '../data/expenses.json')

// Função para ler despesas do arquivo JSON
const readExpenses = () => {
  try {
    const data = fs.readFileSync(expensesPath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

// Função para escrever despesas no arquivo JSON
const writeExpenses = (expenses) => {
  fs.writeFileSync(expensesPath, JSON.stringify(expenses, null, 2))
}

// GET - Listar todas as despesas
router.get('/', (req, res) => {
  try {
    const expenses = readExpenses()
    res.json(expenses)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar despesas' })
  }
})

// GET - Buscar despesa por ID
router.get('/:id', (req, res) => {
  try {
    const expenses = readExpenses()
    const expense = expenses.find(e => e.id === parseInt(req.params.id))
    
    if (!expense) {
      return res.status(404).json({ error: 'Despesa não encontrada' })
    }
    
    res.json(expense)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar despesa' })
  }
})

// POST - Criar nova despesa
router.post('/', (req, res) => {
  try {
    const { date, description, value } = req.body
    
    if (!date || !description || !value) {
      return res.status(400).json({ error: 'Data, descrição e valor são obrigatórios' })
    }
    
    const expenses = readExpenses()
    const newExpense = {
      id: expenses.length > 0 ? Math.max(...expenses.map(e => e.id)) + 1 : 1,
      date,
      description,
      value: parseFloat(value),
      createdAt: new Date().toISOString()
    }
    
    expenses.push(newExpense)
    writeExpenses(expenses)
    
    res.status(201).json(newExpense)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar despesa' })
  }
})

// PUT - Atualizar despesa
router.put('/:id', (req, res) => {
  try {
    const { date, description, value } = req.body
    
    if (!date || !description || !value) {
      return res.status(400).json({ error: 'Data, descrição e valor são obrigatórios' })
    }
    
    const expenses = readExpenses()
    const expenseIndex = expenses.findIndex(e => e.id === parseInt(req.params.id))
    
    if (expenseIndex === -1) {
      return res.status(404).json({ error: 'Despesa não encontrada' })
    }
    
    expenses[expenseIndex] = {
      ...expenses[expenseIndex],
      date,
      description,
      value: parseFloat(value),
      updatedAt: new Date().toISOString()
    }
    
    writeExpenses(expenses)
    
    res.json(expenses[expenseIndex])
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar despesa' })
  }
})

// DELETE - Excluir despesa
router.delete('/:id', (req, res) => {
  try {
    const expenses = readExpenses()
    const expenseIndex = expenses.findIndex(e => e.id === parseInt(req.params.id))
    
    if (expenseIndex === -1) {
      return res.status(404).json({ error: 'Despesa não encontrada' })
    }
    
    expenses.splice(expenseIndex, 1)
    writeExpenses(expenses)
    
    res.json({ message: 'Despesa excluída com sucesso' })
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir despesa' })
  }
})

export default router
