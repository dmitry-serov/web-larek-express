import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';

import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import Product from '../models/product';

export const getProducts = (_req: Request, res: Response, next: NextFunction) => {
  Product.find({})
    .then((items) => res.send({ items, total: items.length }))
    .catch(next);
};

export const createProduct = (req: Request, res: Response, next: NextFunction) => {
  Product.create(req.body)
    .then((product) => res.status(201).send(product))
    .catch((error) => {
      if (error instanceof MongooseError.ValidationError) {
        next(new BadRequestError(error.message));
        return;
      }

      if (error instanceof Error && error.message.includes('E11000')) {
        next(new ConflictError('Товар с таким названием уже существует'));
        return;
      }

      next(error);
    });
};
