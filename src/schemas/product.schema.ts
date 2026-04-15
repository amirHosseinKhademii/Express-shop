import { checkSchema } from "express-validator";

export const createProductRules = checkSchema({
  title: {
    in: ["body"],
    trim: true,
    notEmpty: { errorMessage: "Title is required" },
  },
  price: {
    in: ["body"],
    isFloat: { options: { gt: 0 }, errorMessage: "Price must be a positive number" },
  },
  description: {
    in: ["body"],
    optional: true,
    isString: { errorMessage: "Description must be a string" },
  },
});

export const updateProductRules = checkSchema({
  id: {
    in: ["params"],
    notEmpty: { errorMessage: "Product ID is required" },
  },
  title: {
    in: ["body"],
    optional: true,
    trim: true,
    notEmpty: { errorMessage: "Title cannot be empty" },
  },
  price: {
    in: ["body"],
    optional: true,
    isFloat: { options: { gt: 0 }, errorMessage: "Price must be a positive number" },
  },
  description: {
    in: ["body"],
    optional: true,
    isString: { errorMessage: "Description must be a string" },
  },
});

export const productIdParamRules = checkSchema({
  id: {
    in: ["params"],
    notEmpty: { errorMessage: "Product ID is required" },
  },
});

export const addProductToCartRules = checkSchema({
  productId: {
    in: ["body"],
    notEmpty: { errorMessage: "Product ID is required" },
    isString: { errorMessage: "Product ID must be a string" },
  },
});

export const removeProductFromCartRules = checkSchema({
  productId: {
    in: ["body"],
    notEmpty: { errorMessage: "Product ID is required" },
    isString: { errorMessage: "Product ID must be a string" },
  },
});

export const createOrderRules = checkSchema({
  fromCart: {
    in: ["body"],
    optional: true,
    isBoolean: { errorMessage: "fromCart must be a boolean" },
  },
  items: {
    in: ["body"],
    optional: true,
    isArray: { options: { min: 1, max: 50 }, errorMessage: "Items must be an array with 1-50 items" },
  },
  "items.*.productId": {
    optional: true,
    isInt: { options: { gt: 0 }, errorMessage: "Product ID must be a positive integer" },
  },
  "items.*.quantity": {
    optional: true,
    isInt: { options: { min: 1, max: 999 }, errorMessage: "Quantity must be 1-999" },
  },
});

export const orderIdParamRules = checkSchema({
  id: {
    in: ["params"],
    notEmpty: { errorMessage: "Order ID is required" },
  },
});
