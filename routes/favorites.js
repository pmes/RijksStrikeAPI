const express = require('express')
const router = express.Router()
const request = require('request')
const Favorite = require('../models/favorite')

// Get all favorites
router.get('/', async (req, res) => {
  try {
    const favorites = await Favorite.find()
    res.json(favorites)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get search results
router.get('/:newSearch', getRijksData, async (req, res) => {
  res.json(res.favorite)
})

// Get one favorite
router.get('/:id', getFavorite, (req, res) => {
  res.json(res.favorite)
})

// Create one favorite
router.post('/:id/:comment', async (req, res) => {
  const favorite = new Favorite({
    RijksID: req.params.id,
    fvComment: req.params.comment
  })

  try {
    const newFavorite = await favorite.save()
    res.status(201).json(newFavorite)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Update one favorite
router.patch('/:id/:comment', getFavorite, async (req, res) => {
  if (req.params.comment != null) {
    res.favorite.fvComment = req.params.comment
    res.favorite.fvDate = Date.now()
  }
  try {
    const updatedFavorite = await res.favorite.save()
    res.json(updatedFavorite)
  } catch {
    res.status(400).json({ message: err.message })
  }
})

// Delete one favorite
router.delete('/:id', getFavorite, async (req, res) => {
  try {
    await res.favorite.remove()
    res.json({ message: 'Deleted This Favorite' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

async function getFavorite(req, res, next) {
  try {
    favorite = await Favorite.findById(req.params.id)
    if (favorite == null) {
      return res.status(404).json({ message: 'Cant find favorite' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.favorite = favorite
  next()
}

async function getRijksData(req, res, next) {
  try {
    favorite = request('https://www.rijksmuseum.nl/api/en/collection?q=' + req.params.newSearch + '&key=zPKZKCrw&format=json&culture=en&imgonly=True', async function (err, response, body) {
      var tmp = JSON.parse(body)
      var rijksData = new Array();
      for (i = 0; i < tmp.artObjects.length; i++) {
        rijksData[i] = new Object();
        rijksData[i].RijksID = tmp.artObjects[i].objectNumber;
        rijksData[i].title = tmp.artObjects[i].title;
        rijksData[i].desc = tmp.artObjects[i].longTitle;
        rijksData[i].link = tmp.artObjects[i].links.web;
        rijksData[i].image = tmp.artObjects[i].webImage.url;
        rsFv = await Favorite.findOne({ RijksID: tmp.artObjects[i].objectNumber })
        if (rsFv == null) {
          rijksData[i].id = false
          rijksData[i].fvComment = false
          rijksData[i].fvDate = false
        } else {
          rijksData[i].id = rsFv.id
          rijksData[i].fvComment = rsFv.fvComment
          rijksData[i].fvDate = rsFv.fvDate
        }
      }
      res.favorite = rijksData
      next()
    });
    if (favorite == null) {
      return res.status(404).json({ message: 'Cant find favorite' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

}

module.exports = router