// Sempre importar o express primeiro
const express = require("express")

// Liberação de acesso para o Front-end
const cors = require("cors") 

// Biblioteca para gerar um ID aleatório
const uuid = require( "uuid")


// Sempre tem que vir antes das rotas
const port = 3001 // PORTA 
const app = express() // EXPRESS
app.use(express.json()) // JSON
app.use(cors()) // CORS

const users = []

const checkUserId = (request, response, next) => {
  const { id } = request.params

  const index = users.findIndex(u => u.id === id)

  if (index < 0) {
    return response.status(404).json({ message: "User not found" })
  }

  request.userIndex = index
  request.userId = id

  next()
}

// GET - READ
app.get("/users", (request, response) => {
  return response.json(users)
})

// POST - CREATE
app.post("/users", (request, response) => {
  try {
  const { name, age, email } = request.body
  if (age < 1) throw new Error("Age must be greater than or equal to 1")
  const user = {id: uuid.v4(), name, age, email}
  users.push(user)
  return response.status(201).json(user)
  } catch(err) {
    return response.status(400).json({error: err.message})
  }
})

// PUT - UPDATE
app.put("/users/:id", checkUserId, (request, response) =>{
  const id = request.userId
  const index = request.userIndex
  const { name, age, email } = request.body
  
  const updatedUser = { id, name, age, email }
  
  users[index] = updatedUser

  return response.json(updatedUser)
})

// DELETE
app.delete( "/users/:id", checkUserId, (request, response) => {
  const index = request.userIndex

  users.splice(index, 1)

  return response.json(users)
})

app.listen(port, () =>  console.log(`🌐 Server is running on port ${port}`))