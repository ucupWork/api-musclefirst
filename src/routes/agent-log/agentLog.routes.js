const express = require('express')
const agentLogController = require('../../controllers/agent-log/agentLog.controller')
const router = express.Router()

router
  .get('/', agentLogController.getAllAgentLog)
  .get('/:id', agentLogController.getAgentLogById)
  .post('/', agentLogController.createAgentLog)
  .put('/:id', agentLogController.updateAgentLog)
  .delete('/:id', agentLogController.deleteAgentLog)

module.exports = router
