import Joi from 'joi';

// Appointment Validation
export const appointmentSchema = Joi.object({
  name: Joi.string().min(3).required(),
  phone: Joi.string().min(10).max(15).required(),
  service: Joi.string().required(),
  date: Joi.date().iso().required(),
});

// Checkout Validation
export const checkoutSchema = Joi.object({
  customerName: Joi.string().min(3).required(),
  address: Joi.string().min(10).required(),
  items: Joi.array().min(1).required(), // Cart mein kam se kam ek item ho
  totalPrice: Joi.number().positive().required(),
});