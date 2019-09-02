const express = require('express');
const path = require('path');
const app = express();

const validator = (item, items) => {
  if(!item.name){
    return 'Item name is requried'
  }
  if(!item.price){
    return 'Item price is requried'
  }
  if(items.map(i => i.name).includes(item.name)){
    return 'Item name must be unique'
  }

  item.price = item.price*1;
  if(isNaN(item.price)){
    return 'Item price must be a number'
  }
}

const db = require('./db')('product.json', validator);

app.use(express.json());

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname,'index.html' ));
})

app.get('/api/products', async (req, res, next) => {
    try{
        res.send(await db.findAll());
    }
    catch(ex){
        next(ex);
    }
  })

app.post('/api/products/create', async (req, res, next) => {
  try{
      res.send(await db.create(req.body));
  }
  catch(ex){
      next(ex);
  }
})

app.post('/api/products/:id', async (req, res, next) => {
  try{
      res.send(await db.destroy(req.body.id));
  }
  catch(ex){
      next(ex);
  }
})

app.use((err, req, res, next)=> {
  console.log(err);
  res.status(500).send({ message: err.message});
});

app.listen(3000, () => console.log(`listening on 3000`));



