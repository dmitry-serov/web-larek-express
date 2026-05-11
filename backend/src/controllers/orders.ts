import { randomUUID } from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';

import BadRequestError from '../errors/bad-request-error';
import Product from '../models/product';

type OrderRequestBody = {
  total: number;
  items: string[];
};

const createOrder = (
  req: Request<unknown, unknown, OrderRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  const { items, total } = req.body;
  const uniqueItemIds = [...new Set(items)];

  Product.find({ _id: { $in: uniqueItemIds } })
    .then((products) => {
      if (products.length !== uniqueItemIds.length) {
        next(new BadRequestError('Передан несуществующий товар'));
        return;
      }

      const productsById = new Map(products.map((product) => [product._id.toString(), product]));
      const productsTotal = items.reduce((sum, itemId) => {
        const product = productsById.get(itemId);

        if (!product || product.price === null) {
          return NaN;
        }

        return sum + product.price;
      }, 0);

      if (Number.isNaN(productsTotal)) {
        next(new BadRequestError('Передан товар, который не продается'));
        return;
      }

      if (productsTotal !== total) {
        next(new BadRequestError('Передана неверная сумма заказа'));
        return;
      }

      res.send({ id: randomUUID(), total });
    })
    .catch((error) => {
      if (error instanceof MongooseError.CastError) {
        next(new BadRequestError('Передан некорректный id товара'));
        return;
      }

      next(error);
    });
};

export default createOrder;
