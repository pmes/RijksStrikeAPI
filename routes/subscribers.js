const express = require('express')
const router = express.Router()
const request = require('request')
const Subscriber = require('../models/subscriber')

// Get all subscribers
router.get('/:newSearch', async (req, res) => {
request('https://www.rijksmuseum.nl/api/nl/collection?q=' + req.params.newSearch + '&key=zPKZKCrw&format=json&culture=en', function (err, response, body) {
    if (err || response.statusCode !== 200) {
      return res.sendStatus(500);
    }
    res.json(body)
  });
})

// Get one subscriber
router.get('/:id', getSubscriber, (req, res) => {
    res.json(res.subscriber)
})

// Create one subscriber
router.post('/', async (req, res) => {
    const subscriber = new Subscriber({
        name: req.body.name,
        subscribedChannel: req.body.subscribedChannel
      })
    
      try {
        const newSubscriber = await subscriber.save()
        res.status(201).json(newSubscriber)
      } catch (err) {
        res.status(400).json({ message: err.message })
      }
})

// Update one subscriber
router.patch('/:id', getSubscriber, async (req, res) => {
    if (req.body.name != null) {
        res.subscriber.name = req.body.name
      }
    
      if (req.body.subscribedChannel != null) {
        res.subscriber.subscribedChannel = req.body.subscribedChannel
      }
      try {
        const updatedSubscriber = await res.subscriber.save()
        res.json(updatedSubscriber)
      } catch {
        res.status(400).json({ message: err.message })
      }
})

// Delete one subscriber
router.delete('/:id', getSubscriber, async (req, res) => {
    try {
        await res.subscriber.remove()
        res.json({ message: 'Deleted This Subscriber' })
      } catch(err) {
        res.status(500).json({ message: err.message })
      }
})

async function getSubscriber(req, res, next) {
    try {
      subscriber = await Subscriber.findById(req.params.id)
      if (subscriber == null) {
        return res.status(404).json({ message: 'Cant find subscriber'})
      }
    } catch(err){
      return res.status(500).json({ message: err.message })
    }
  
    res.subscriber = subscriber
    next()
  }

module.exports = router