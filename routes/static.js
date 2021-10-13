const express = require ('express')
const router=express.Router()


router.get('/story',(req,res)=>{
    
  res.render('statics/story')
})

router.get('/about', (req,res)=>{
  res.render('statics/about')
})


module.exports = router
