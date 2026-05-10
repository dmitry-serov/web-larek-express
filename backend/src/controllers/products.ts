import { Request, Response, NextFunction } from 'express';

import Product from '../models/product';

export const getProducts = (_req: Request, res: Response, next: NextFunction) => {
  Product.find({})
    .then((items) => res.send({ items, total: items.length }))
    .catch(next);
};

export const createProduct = (req: Request, res: Response, next: NextFunction) => {
  Product.create(req.body)
    .then((product) => res.status(201).send(product))
    .catch(next);
};
