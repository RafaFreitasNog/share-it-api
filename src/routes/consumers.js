const express = require('express')
const prisma = require('../database/config')
const router = express.Router()

//GET routes
//get all
router.get('/', async (req, res) => {
  try {
    const consumers = await prisma.consumer.findMany({})
    res.status(200).json(consumers)
  } catch (error) {
    res.status(500).json(error)
  }
})

//get by Desk
router.get('/bydesk/:id', async (req, res) => {
  try {
    const { id } = req.params
    const consumer = await prisma.consumer.findMany({
      where:{
        deskId: id
      },
      include: {
        orders: {
          include: {
            _count: {
              select: {
                consumers: true
              }
            }
          }
        }
      }
    })
    if (!consumer) {
      res.status(400).json({message: 'Record to get does not exist'})
    } else {
      res.status(200).json(consumer)
    }
  } catch (error) {
    res.status(500).json(error)
  }
})

//get one
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const consumer = await prisma.consumer.findUnique({
      where:{
        id: id
      }
    })
    if (!consumer) {
      res.status(400).json({message: 'Record to get does not exist'})
    } else {
      res.status(200).json(consumer)
    }
  } catch (error) {
    res.status(500).json(error)
  }
})

//POST routes 
//add new
router.post('/', async (req, res) => {
  try {
    const { name, deskId } = req.body
    const consumer = await prisma.consumer.create({
      data: {
        name: name,
        Desk: {
          connect: {
            id: deskId
          },
        }
      }
    })
    res.status(201).json(consumer)
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
    const consumer = await prisma.consumer.update({
      where:{
        id: id
      },
      data: {
        name: name
      }
    })
    if (!consumer) {
      res.status(400).json({message: 'Record to update does not exist'})
    } else {
      res.status(200).json(consumer)
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
    const consumer = await prisma.consumer.delete({
      where:{
        id: id
      }
    })
    res.status(200).json(consumer)
  } catch (error) {
    res.status(200).json(error)
  }
})

module.exports = router