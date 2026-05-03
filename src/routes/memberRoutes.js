const { Router } = require('express');
const ctrl = require('../controllers/memberController');
const { validate } = require('../middleware/errorHandler');
const {
  createMemberValidator,
  updateMemberValidator,
  getMembersValidator,
  idParamValidator,
} = require('../validators/memberValidator');

const router = Router();

router.post('/', createMemberValidator, validate, ctrl.createMember);
router.get('/', getMembersValidator, validate, ctrl.getAllMembers);
router.get('/:id', idParamValidator, validate, ctrl.getMemberById);
router.put('/:id', updateMemberValidator, validate, ctrl.updateMember);
router.delete('/:id', idParamValidator, validate, ctrl.deleteMember);

module.exports = router;
