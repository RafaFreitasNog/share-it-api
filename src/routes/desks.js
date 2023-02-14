const express = require('express')
const prisma = require('../database/config')
const router = express.Router()

//GET routes
//get all
router.get('/', async (req, res) => {
  const desks = await prisma.desk.findMany({})
  res.status(200).json(desks)
})

//get one
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const desk = await prisma.desk.findUnique({
      where:{
        id: id
      }
    })
    if (!desk) {
      res.status(400).json({message: 'Record to get does not exist'})
    } else {
      res.status(200).json(desk)
    }
  } catch (error) {
    res.status(500).json(error)
  }
})

//Post routes
//add new
router.post('/', async (req, res) => {
  try {
    const { name } = req.body
    const desk = await prisma.desk.create({
      data: {
        name: name,
      }
    })
    res.status(201).json(desk)
  } catch (error) {
    res.status(500).json(error)
  }
})

//PUT routes
//edit one
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name } = req.body
    const desk = await prisma.desk.update({
      where:{
        id: id
      },
      data: {
        name: name,
      }
    })
    if (!desk) {
      res.status(400).json({message: 'Record to update does not exist'})
    } else {
      res.status(200).json(desk)
    }
  } catch (error) {
    res.status(500).json(error)
  }
})

//DELETE routes
//delete one
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const orders = prisma.order.deleteMany({
      where: {
        deskId: id
      }
    })

    const consumers = prisma.consumer.deleteMany({
      where:{
        deskId: id
      }
    })

    const desk = prisma.desk.delete({
      where: {
        id: id
      }
    })
    
    try {
      const trans = await prisma.$transaction([orders, consumers, desk])
      res.status(200).json(trans)
    } catch (error) {
      res.status(400).json({message: 'Record to delete does not exist'})
    }

  } catch (error) {
    res.status(500).json(error)
  }
})


module.exports = router