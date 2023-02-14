const express = require('express')
const prisma = require('../database/config')
const router = express.Router()

//GET routes
//get all
router.get('/', async (req, res) => {
  const desks = await prisma.order.findMany({})
  res.status(200).json(desks)
})

//get one
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const order = await prisma.order.findUnique({
      where: {
        id: id
      }
    })
    if (!order) {
      res.status(400).json({message: 'Record to get does not exist'})
    } else {
      res.status(200).json(order)
    }
  } catch (error) {
    res.status(500).json(error)
  }
})

//Post routes
//add new
router.post('/', async (req, res) => {
  try {
    const { name, price, deskId, consumersIds } = req.body
    const order = await prisma.order.create({
      data: {
        name: name,
        price: price,
        pricePerClient: calculatePerPerson(price, consumersIds.length),
        Desk: {
          connect: {
            id: deskId
          },
        },
        consumers: {
          connect: toConnectArray(consumersIds)
        }
      }
    })
    res.status(201).json(order)
  } catch (error) {
    res.status(500).json(error)
  }
})

//PUT routes
//edit one
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { consumersIds } = req.body
    const findOrder = await prisma.order.findUnique({where:{id: id}})
    if (!findOrder) {
      res.status(400).json({message: 'Record to update does not exist'})
    } else {
      const order = await prisma.order.update({
        where:{
          id: id
        },
        data: {
          consumers: {
            set: [],  
            connect: toConnectArray(consumersIds)
          },
          pricePerClient: calculatePerPerson(findOrder.price, consumersIds.length)
        }
      })
      res.status(200).json(order)
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
    const order = await prisma.order.delete({
      where: {
        id: id
      }
    })
    if (!order) {
      res.status(400).json({message: 'Record to delete does not exist'})
    } else {
      res.status(200).json(order)
    }
  } catch (error) {
    res.status(500).json(error)
  }
})



function toConnectArray(idArray) {
  const result = idArray.map((element) => {
    return {
      id: element
    }
  })
  return result
}

function calculatePerPerson(price, people) {
  const result = price / people
  const fixedNumber = parseFloat(result.toFixed(2))
  return fixedNumber
}

module.exports = router