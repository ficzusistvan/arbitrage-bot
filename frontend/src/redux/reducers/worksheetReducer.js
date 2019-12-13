import { INIT_WORKSHEET, CLEAR_WORKSHEET, 
  ADD_PRODUCT, REMOVE_PRODUCT, UPDATE_PRODUCT_QUANTITY, SET_PRODUCT_KIND, 
  ADD_OPTION, REMOVE_OPTION, UPDATE_OPTION_QUANTITY, SET_OPTION_KIND, } from "../actions/types";

const worksheet = (state = { products: [], options: [], users: [] }, action) => {
  switch (action.type) {
    /** Worksheet */
    case INIT_WORKSHEET: {
      return {
        ...state,
        products: action.products.map(product => (
          { code: product.product_code, quantity: product.quantity, kind: product.kind }
        )),
        options: action.options.map(option => (
          { productCode: option.product_code, code: option.option_code, quantity: option.quantity, kind: option.kind }
        )),
        users: action.users.map(user => (
          { id: user.user_id, in: user.in, out: user.out }
        ))
      }
    }
    case CLEAR_WORKSHEET: {
      return { products: [], options: [], users: [] }
    }
    /** Product */
    case ADD_PRODUCT: {
      return {
        ...state,
        products: [
          ...state.products,
          {
            code: action.code,
            quantity: 1,
            kind: null
          }
        ]
      }
    }
    case REMOVE_PRODUCT: {
      return {
        ...state,
        products: state.products.filter(product => product.code !== action.code)
      }
    }
    case UPDATE_PRODUCT_QUANTITY: {
      return {
        ...state,
        products: state.products.map(product => {
          if (product.code !== action.code) {
            // This isn't the product we care about - keep it as-is
            return product
          }

          // Otherwise, this is the one we want - return an updated value
          return {
            code: action.code,
            quantity: Number(action.quantity),
            kind: product.kind
          }
        })
      }
    }
    case SET_PRODUCT_KIND: {
      return {
        ...state,
        products: state.products.map(product => {
          if (product.code !== action.code) {
            // This isn't the product we care about - keep it as-is
            return product
          }

          // Otherwise, this is the one we want - return an updated value
          return {
            code: action.code,
            quantity: product.quantity,
            kind: action.kind
          }
        })
      }
    }
    /** Option */
    case ADD_OPTION: {
      return {
        ...state,
        options: [
          ...state.options,
          {
            productCode: action.productCode,
            code: action.optionCode,
            quantity: 1,
            kind: null
          }
        ]
      }
    }
    case REMOVE_OPTION: {
      return {
        ...state,
        options: state.options.filter(option => option.code !== action.optionCode && option.productCode !== action.productCode)
      }
    }
    case UPDATE_OPTION_QUANTITY: {
      return {
        ...state,
        options: state.options.map(option => {
          if (option.productCode !== action.productCode || option.code !== action.optionCode) {
            // This isn't the option we care about - keep it as-is
            return option
          }

          // Otherwise, this is the one we want - return an updated value
          return {
            productCode: action.productCode,
            code: action.optionCode,
            quantity: Number(action.quantity),
            kind: option.kind
          }
        })
      }
    }
    case SET_OPTION_KIND: {
      return {
        ...state,
        options: state.options.map(option => {
          if (option.productCode !== action.productCode || option.code !== action.optionCode) {
            // This isn't the option we care about - keep it as-is
            return option
          }

          // Otherwise, this is the one we want - return an updated value
          return {
            productCode: action.productCode,
            code: action.optionCode,
            quantity: option.quantity,
            kind: action.kind
          }
        })
      }
    }

    default:
      return state;
  }
}

export default worksheet