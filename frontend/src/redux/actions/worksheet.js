import { INIT_WORKSHEET, CLEAR_WORKSHEET, 
  ADD_PRODUCT, REMOVE_PRODUCT, UPDATE_PRODUCT_QUANTITY, SET_PRODUCT_KIND, 
  ADD_OPTION, REMOVE_OPTION, UPDATE_OPTION_QUANTITY, SET_OPTION_KIND } from "./types";

/** Worksheet */
export const initWorksheet = (products, options, users) => ({
  type: INIT_WORKSHEET,
  products,
  options,
  users
});

export const clearWorksheet = () => ({
  type: CLEAR_WORKSHEET
});

/** Product */
export const addProduct = (code) => ({
  type: ADD_PRODUCT,
  code
});

export const removeProduct = (code) => ({
  type: REMOVE_PRODUCT,
  code
});

export const updateProductQuantity = (code, quantity) => ({
  type: UPDATE_PRODUCT_QUANTITY,
  code,
  quantity
});

export const setProductKind = (code, kind) => ({
  type: SET_PRODUCT_KIND,
  code,
  kind
});

/** Option */
export const addOption = (productCode, optionCode) => ({
  type: ADD_OPTION,
  productCode,
  optionCode
});

export const removeOption = (productCode, optionCode) => ({
  type: REMOVE_OPTION,
  productCode,
  optionCode
});

export const updateOptionQuantity = (productCode, optionCode, quantity) => ({
  type: UPDATE_OPTION_QUANTITY,
  productCode,
  optionCode,
  quantity
});

export const setOptionKind = (productCode, optionCode, kind) => ({
  type: SET_OPTION_KIND,
  productCode,
  optionCode,
  kind
});