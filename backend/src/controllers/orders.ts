import { randomUUID } from 'crypto';
import { Request, Response, NextFunction } from 'express';

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
        res.status(400).send({ message: 'Передан несуществующий товар' });
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
        res.status(400).send({ message: 'Передан товар, который не продается' });
        return;
      }

      if (productsTotal !== total) {
        res.status(400).send({ message: 'Передана неверная сумма заказа' });
        return;
      }

      res.send({ id: randomUUID(), total });
    })
    .catch(next);
};

export default createOrder;
