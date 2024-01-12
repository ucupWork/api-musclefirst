const { supabase } = require('../../config/db')
const commonHelper = require('../../helper/common')

const profilesController = {
  createDataAgent: async (req, res) => {
    try {
      const {
        id,
        updated_at,
        full_name,
        company_name,
        avatar_url,
        usr_phone,
        sos_ig,
        sos_tiktok,
        sos_youtube,
        usr_agent,
        usr_member,
        usr_team,
        usr_premi
      } = req.body
      const { data, error } = await supabase.from('tb_profiles').insert({
        id,
        updated_at,
        full_name,
        company_name,
        avatar_url,
        usr_phone,
        sos_ig,
        sos_tiktok,
        sos_youtube,
        usr_agent,
        usr_member,
        usr_team,
        usr_premi
      })

      if (error) {
        throw new Error(error.message)
      }

      commonHelper.response(res, data, 201, 'Data saved successfully')
    } catch (error) {
      commonHelper.response(res, error, 500, 'Error while adding data')
    }
  },
  createDataUser: async (req, res) => {
    try {
      const {
        id,
        updated_at,
        full_name,
        avatar_url,
        usr_phone,
        sos_ig,
        sos_tiktok,
        sos_youtube,
        usr_agent,
        usr_member,
        usr_team,
        usr_premi
      } = req.body
      const { data, error } = await supabase.from('tb_profiles').insert({
        id,
        updated_at,
        full_name,
        avatar_url,
        usr_phone,
        sos_ig,
        sos_tiktok,
        sos_youtube,
        usr_agent,
        usr_member,
        usr_team,
        usr_premi
      })

      if (error) {
        throw new Error(error.message)
      }

      commonHelper.response(res, data, 201, 'Data saved successfully')
    } catch (error) {
      commonHelper.response(res, error, 500, 'Error while adding data')
    }
  },
  updateData: async (req, res) => {
    try {
      const { id } = req.params
      const {
        updated_at,
        full_name,
        company_name,
        avatar_url,
        usr_phone,
        usr_agent,
        usr_member,
        usr_team,
        usr_premi
      } = req.body

      // check if Data is existing
      const { data: existingData, error: existingDataError } = await supabase
        .from('tb_profiles')
        .select('*')
        .eq('id', id)

      if (existingDataError) {
        return commonHelper.response(
          res,
          existingDataError.message,
          404,
          'Data not found'
        )
      }

      if (!existingData || existingData.length === 0) {
        return commonHelper.response(res, null, 404, 'Data not found')
      }

      const { error } = await supabase
        .from('tb_profiles')
        .update({
          updated_at,
          full_name,
          company_name,
          avatar_url,
          usr_phone,
          usr_agent,
          usr_member,
          usr_team,
          usr_premi
        })
        .eq('id', id)

      if (error) {
        return commonHelper.response(res, error, 500, 'Error updating Data')
      }

      // Fetch the updated Data from the database
      const { data: updatedData, error: updatedDataError } = await supabase
        .from('tb_profiles')
        .select('*')
        .eq('id', id)

      if (updatedDataError) {
        return commonHelper.response(
          res,
          updatedDataError.message,
          500,
          'Error getting updated Data'
        )
      }

      const data = {
        assetssData: updatedData[0],
        userData: null
      }

      commonHelper.response(res, data, 200, 'Data updated successfully')
    } catch (error) {
      commonHelper.response(res, error, 500, 'Error updating Data')
    }
  },
  getAllData: async (req, res) => {
    try {
      const { page, limit } = req.query
      const currentPage = parseInt(page, 10) || 1
      const pageSize = parseInt(limit, 10) || 15
      const start = (currentPage - 1) * pageSize
      const end = start + pageSize - 1

      const { data, error } = await supabase
        .from('tb_profiles')
        .select("'*'")
        .range(start, end)

      if (error) {
        throw new Error(error.message)
      }

      const { error: countError, count } = await supabase
        .from('tb_profiles')
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
        'Success getting all data',
        pagination
      )
    } catch (error) {
      commonHelper.response(res, null, 500, 'Error retrieving all data')
    }
  },
  getSingleDataById: async (req, res) => {
    try {
      const { id } = req.params
      const { data: assetssData, error: agentError } = await supabase
        .from('tb_profiles')
        .select('*')
        .eq('id', id)
        .single()

      if (agentError) {
        return commonHelper.response(
          res,
          agentError.message,
          404,
          'Data not found'
        )
      }

      commonHelper.response(res, assetssData, 200, 'Success getting data')
    } catch (error) {
      commonHelper.response(res, error, 500, 'Error getting data')
    }
  },
  deleteData: async (req, res) => {
    try {
      const { id } = req.params

      const { data: existingData, error: existingDataError } = await supabase
        .from('tb_profiles')
        .select('id')
        .eq('id', id)

      if (existingDataError) {
        throw new Error(existingDataError.message)
      }

      if (!existingData || existingData.length === 0) {
        return commonHelper.response(res, null, 404, 'Data not found')
      }

      const { error: deleteError } = await supabase
        .from('tb_profiles')
        .delete()
        .eq('id', id)

      if (deleteError) {
        throw new Error(deleteError.message)
      }

      commonHelper.response(res, null, 200, 'Data deleted successfully')
    } catch (error) {
      commonHelper.response(res, error, 500, 'Error while deleting data')
    }
  }
}

module.exports = profilesController
