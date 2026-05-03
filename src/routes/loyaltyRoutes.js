const { Router } = require('express');
const ctrl = require('../controllers/loyaltyController');
const { validate } = require('../middleware/errorHandler');
const {
  updateSettingsValidator,
  createEarnRuleValidator,
  updateEarnRuleValidator,
  toggleEarnRuleValidator,
  idParamValidator,
  earnPointsValidator,
  redeemPointsValidator,
  leaderboardValidator,
  transactionsValidator,
} = require('../validators/loyaltyValidator');

const router = Router();


router.get('/settings', ctrl.getSettings);
router.put('/settings', updateSettingsValidator, validate, ctrl.updateSettings);


router.post('/earn-rules', createEarnRuleValidator, validate, ctrl.createEarnRule);
router.get('/earn-rules', ctrl.getAllEarnRules);
router.put('/earn-rules/:id', updateEarnRuleValidator, validate, ctrl.updateEarnRule);
router.patch('/earn-rules/:id/toggle', toggleEarnRuleValidator, validate, ctrl.toggleEarnRule);
router.delete('/earn-rules/:id', idParamValidator, validate, ctrl.deleteEarnRule);


router.post('/earn', earnPointsValidator, validate, ctrl.earnPoints);
router.post('/redeem', redeemPointsValidator, validate, ctrl.redeemPoints);


router.get('/leaderboard', leaderboardValidator, validate, ctrl.getLeaderboard);
router.get('/transactions/:memberId', transactionsValidator, validate, ctrl.getMemberTransactions);

module.exports = router;
