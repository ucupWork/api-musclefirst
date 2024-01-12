const { supabase } = require('../../config/db')
const commonHelper = require('../../helper/common')

const agentLogController = {
  createAgentLog: async (req, res) => {
    try {
      const {
        log_name,
        log_phone,
        log_visit,
        log_name_tag,
        log_button_id,
        log_domisili,
        log_note,
        log_count
      } = req.body
      const { data, error } = await supabase.from('tb_agent_log').insert({
        log_name,
        log_phone,
        log_visit,
        log_name_tag,
        log_button_id,
        log_domisili,
        log_note,
        log_count
      })

      if (error) {
        throw new Error(error.message)
      }

      commonHelper.response(res, data, 201, 'Agent_log saved successfully')
    } catch (error) {
      commonHelper.response(res, error, 500, 'Error while adding Agent_log')
    }
  },
  updateAgentLog: async (req, res) => {
    try {
      const { id } = req.params
      const {
        log_name,
        log_phone,
        log_visit,
        log_name_tag,
        log_button_id,
        log_domisili,
        log_note,
        log_count
      } = req.body

      // check if agent_log is existing
      const { data: existingAgent, error: existingAgentError } = await supabase
        .from('tb_agent_log')
        .select('*')
        .eq('id', id)

      if (existingAgentError) {
        return commonHelper.response(
          res,
          existingAgentError.message,
          404,
          'agent_log not found'
        )
      }

      if (!existingAgent || existingAgent.length === 0) {
        return commonHelper.response(res, null, 404, 'agent_log not found')
      }

      const { error } = await supabase
        .from('tb_agent_log')
        .update({
          log_name,
          log_phone,
          log_visit,
          log_name_tag,
          log_button_id,
          log_domisili,
          log_note,
          log_count
        })
        .eq('id', id)

      if (error) {
        return commonHelper.response(
          res,
          error,
          500,
          'Error updating agent_log'
        )
      }

      // Fetch the updated agent_log from the database
      const { data: updatedAgentLog, error: updatedAgentLogError } =
        await supabase.from('tb_agent_log').select('*').eq('id', id)

      if (updatedAgentLogError) {
        return commonHelper.response(
          res,
          updatedAgentLogError.message,
          500,
          'Error getting updated agent_log'
        )
      }

      const data = {
        agentLogData: updatedAgentLog[0],
        userData: null
      }

      commonHelper.response(res, data, 200, 'agent_log updated successfully')
    } catch (error) {
      commonHelper.response(res, error, 500, 'Error updating agent_log')
    }
  },
  getAllAgentLog: async (req, res) => {
    try {
      const { page, limit } = req.query
      const currentPage = parseInt(page, 10) || 1
      const pageSize = parseInt(limit, 10) || 15
      const start = (currentPage - 1) * pageSize
      const end = start + pageSize - 1

      const { data, error } = await supabase
        .from('tb_agent_log')
        .select("'*'")
        .range(start, end)

      if (error) {
        throw new Error(error.message)
      }

      const { error: countError, count } = await supabase
        .from('tb_agent_log')
        .select('*', { count: 'exact' })

      if (countError) {
        throw new Error(countError.message)
      }

      const totalRecords = count

      const totalPages = Math.ceil(totalRecords / pageSize)

      const pagination = {
        currentPage,
        totalPages,
        totalRecords
      }

      commonHelper.response(
        res,
        data,
        200,
        'Success getting all agent_log',
        pagination
      )
    } catch (error) {
      commonHelper.response(res, null, 500, 'Error retrieving all agent_log')
    }
  },
  getAgentLogById: async (req, res) => {
    try {
      const { id } = req.params
      const { data: agentLogData, error: agentError } = await supabase
        .from('tb_agent_log')
        .select('*')
        .eq('id', id)
        .single()

      if (agentError) {
        return commonHelper.response(
          res,
          agentError.message,
          404,
          'agent_log not found'
        )
      }

      commonHelper.response(res, agentLogData, 200, 'Success getting agent_log')
    } catch (error) {
      commonHelper.response(res, error, 500, 'Error getting agent_log')
    }
  },
  deleteAgentLog: async (req, res) => {
    try {
      const { id } = req.params

      const { data: existingAgent, error: existingAgentError } = await supabase
        .from('tb_agent_log')
        .select('id')
        .eq('id', id)

      if (existingAgentError) {
        throw new Error(existingAgentError.message)
      }

      if (!existingAgent || existingAgent.length === 0) {
        return commonHelper.response(res, null, 404, 'agent_log not found')
      }

      const { error: deleteError } = await supabase
        .from('tb_agent_log')
        .delete()
        .eq('id', id)

      if (deleteError) {
        throw new Error(deleteError.message)
      }

      commonHelper.response(res, null, 200, 'agent_log deleted successfully')
    } catch (error) {
      commonHelper.response(res, error, 500, 'Error while deleting agent_log')
    }
  }
}

module.exports = agentLogController
