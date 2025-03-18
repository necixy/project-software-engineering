import { Request, Response } from "express";
import Stripe from "stripe";
const stripe: Stripe = new Stripe(
  `sk_test_51PDvJD07ZECLJyzZ7c2vqv8XoTYtFL2a0NGqvLRX5aV5sHV8jM1rJC4oFelhGOAiqHl6ic7EVJBUce98LWJf9LFe00rLT3rGP0`
);
const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, metadata } = req.body;
    const product = await stripe.products.create({
      name,
      description,
      metadata,
    });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, metadata } = req.body;
    const product = await stripe.products.update(id, {
      name,
      description,
      metadata,
    });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await stripe.products.del(id);
    res.status(200).json(deleted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { createProduct, updateProduct, deleteProduct };
