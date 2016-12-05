import mongoose from 'mongoose';
import { Router } from 'express';
import FoodTruck from '../model/foodtruck';
import Review from '../model/review';

export default ({config, db}) => {
  let api = Router();

  // CRUD = Create Read Update Delete

  // '/v1/foodtruck/add' - Create
  api.post('/add', (req, res) => {
    let newTruck = new FoodTruck();
    newTruck.name = req.body.name;

    newTruck.save(err => {
      if(err){
        res.send(err);
      }

      res.json({message: 'FoodTruck saved successfully'});
    });
  });

  // '/v1/foodtruck' - Read
  api.get('/', (req, res) => {
	  FoodTruck.find({}, (err, foodtrucks) => {
      if(err){
        res.send(err);
      }
      res.json(foodtrucks);
    });
  });

  // '/v1/foodtruck/:id' - Read
  api.get('/:id', (req, res) => {
	  FoodTruck.findById(req.params.id, (err, foodtruck) => {
      if(err){
        res.send(err);
      }
      res.json(foodtruck);
    });
  });

  // '/v1/foodtruck/:id' - Read
  api.put('/:id', (req, res) => {
    FoodTruck.findById(req.params.id, (err, foodtruck) => {
      if(err){
        res.send(err);
      }

	    foodtruck.name = req.body.name;
	    foodtruck.save(err=> {
        if(err){
          res.send(err);
        }
        res.json({ message: "FoodTruck info updated"});
      });
    });
  });

	// '/v1/foodtruck/:id' - Delete
  api.delete('/:id', (req, res) => {
	  FoodTruck.remove({
      _id: req.params.id
    }, (err) => {
      if(err){
        res.send(err);
      }
      res.json({ message: 'FoodTruck Successfully Removed!'});
    });
  });

  // add a review for a specific food truck
  // '/v1/foodtruck/reviews/add/:id
  api.post('/reviews/add/:id', (req, res) => {
    FoodTruck.findById(req.params.id, (err, foodtruck) => {
      if(err){
        res.send(err);
      }
      let newReview = new Review();

      newReview.title = req.body.title;
      newReview.text = req.body.text;
      newReview.foodtruck = foodtruck._id;
      newReview.save((err, review) => {
        if(err){
          res.send(err);
        }
        foodtruck.reviews.push(newReview);
        foodtruck.save(err => {
	        if(err){
		        res.send(err);
	        }
	        res.json({message: 'Food truck review saved!'});
        });
      });
    });
  });

  return api;
}