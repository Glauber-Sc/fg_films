import express from "express"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import fs from "fs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const router = express.Router()
const expensesPath = join(__dirname, '../data/expenses.json')

const readExpenses = () => {
  try {
    const data = fs.readFileSync(expensesPath, 'utf8')
    return data?.trim() ? JSON.parse(data) : []
  } catch {
    return []
  }
}
const writeExpenses = (expenses) => {
  fs.writeFileSync(expensesPath, JSON.stringify(expenses, null, 2))
}

/** Se vier "YYYY-MM-DD", transforma em "YYYY-MM-DDT12:00:00" (hora local)
 *  Se vier ISO em UTC (terminando com 'Z'), converte para horário local (sem 'Z').
 */
function ensureLocalMidday(dateStr) {
  if (!dateStr) return dateStr
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return `${dateStr}T12:00:00`
  }
  if (/[Zz]$/.test(dateStr)) {
    const d = new Date(dateStr) // interpreta em UTC
    const pad = (n) => String(n).padStart(2, "0")
    const y = d.getFullYear()
    const m = pad(d.getMonth() + 1)
    const day = pad(d.getDate())
    const hh = pad(d.getHours())
    const mm = pad(d.getMinutes())
    const ss = pad(d.getSeconds())
    return `${y}-${m}-${day}T${hh}:${mm}:${ss}` // local, sem Z
  }
  return dateStr
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
    const expense = expenses.find(e => e.id === parseInt(req.params.id, 10))
    if (!expense) return res.status(404).json({ error: 'Despesa não encontrada' })
    res.json(expense)
  } catch {
    res.status(500).json({ error: 'Erro ao buscar despesa' })
  }
})

// POST - Criar nova despesa
router.post('/', (req, res) => {
  try {
    const { date, description, value } = req.body
    if (!date || !description || value == null) {
      return res.status(400).json({ error: 'Data, descrição e valor são obrigatórios' })
    }

    const expenses = readExpenses()
    const newExpense = {
      id: expenses.length > 0 ? Math.max(...expenses.map(e => e.id)) + 1 : 1,
      date: ensureLocalMidday(String(date)),
      description: String(description),
      value: parseFloat(value),
      createdAt: new Date().toISOString()
    }

    expenses.push(newExpense)
    writeExpenses(expenses)
    res.status(201).json(newExpense)
  } catch {
    res.status(500).json({ error: 'Erro ao criar despesa' })
  }
})

// PUT - Atualizar despesa
router.put('/:id', (req, res) => {
  try {
    const { date, description, value } = req.body
    if (!date || !description || value == null) {
      return res.status(400).json({ error: 'Data, descrição e valor são obrigatórios' })
    }

    const expenses = readExpenses()
    const idx = expenses.findIndex(e => e.id === parseInt(req.params.id, 10))
    if (idx === -1) return res.status(404).json({ error: 'Despesa não encontrada' })

    expenses[idx] = {
      ...expenses[idx],
      date: ensureLocalMidday(String(date)),
      description: String(description),
      value: parseFloat(value),
      updatedAt: new Date().toISOString()
    }

    writeExpenses(expenses)
    res.json(expenses[idx])
  } catch {
    res.status(500).json({ error: 'Erro ao atualizar despesa' })
  }
})

// DELETE - Excluir despesa
router.delete('/:id', (req, res) => {
  try {
    const expenses = readExpenses()
    const idx = expenses.findIndex(e => e.id === parseInt(req.params.id, 10))
    if (idx === -1) return res.status(404).json({ error: 'Despesa não encontrada' })

    expenses.splice(idx, 1)
    writeExpenses(expenses)
    res.json({ message: 'Despesa excluída com sucesso' })
  } catch {
    res.status(500).json({ error: 'Erro ao excluir despesa' })
  }
})

export default router
