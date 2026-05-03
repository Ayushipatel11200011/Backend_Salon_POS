const { Router } = require('express');
const ctrl = require('../controllers/discountController');
const { validate } = require('../middleware/errorHandler');
const {
  createDiscountValidator,
  updateDiscountValidator,
  toggleDiscountValidator,
  getDiscountsValidator,
  idParamValidator,
} = require('../validators/discountValidator');

const router = Router();

router.post('/', createDiscountValidator, validate, ctrl.createDiscount);
router.get('/', getDiscountsValidator, validate, ctrl.getAllDiscounts);
router.get('/active', ctrl.getActiveDiscounts);
router.get('/:id', idParamValidator, validate, ctrl.getDiscountById);
router.put('/:id', updateDiscountValidator, validate, ctrl.updateDiscount);
router.patch('/:id/toggle', toggleDiscountValidator, validate, ctrl.toggleDiscount);
router.delete('/:id', idParamValidator, validate, ctrl.deleteDiscount);

module.exports = router;
