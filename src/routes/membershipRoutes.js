const { Router } = require('express');
const ctrl = require('../controllers/membershipController');
const { validate } = require('../middleware/errorHandler');
const {
  createMembershipValidator,
  updateMembershipValidator,
  idParamValidator,
} = require('../validators/membershipValidator');

const router = Router();

router.post('/', createMembershipValidator, validate, ctrl.createMembership);
router.get('/', ctrl.getAllMemberships);
router.get('/:id', idParamValidator, validate, ctrl.getMembershipById);
router.put('/:id', updateMembershipValidator, validate, ctrl.updateMembership);
router.delete('/:id', idParamValidator, validate, ctrl.deleteMembership);

module.exports = router;
