const { Router } = require('express');
const ctrl = require('../controllers/packageController');
const { validate } = require('../middleware/errorHandler');
const {
  createPackageValidator,
  updatePackageValidator,
  togglePackageValidator,
  getPackagesValidator,
  idParamValidator,
} = require('../validators/packageValidator');

const router = Router();

router.post('/', createPackageValidator, validate, ctrl.createPackage);
router.get('/', getPackagesValidator, validate, ctrl.getAllPackages);
router.get('/active', ctrl.getActivePackages);
router.get('/:id', idParamValidator, validate, ctrl.getPackageById);
router.put('/:id', updatePackageValidator, validate, ctrl.updatePackage);
router.patch('/:id/toggle', togglePackageValidator, validate, ctrl.togglePackage);
router.delete('/:id', idParamValidator, validate, ctrl.deletePackage);

module.exports = router;
