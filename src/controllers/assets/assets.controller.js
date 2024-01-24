const { supabase } = require('../../config/db')
const commonHelper = require('../../helper/common')

const assetsController = {
  createAssetss: async (req, res) => {
    try {
      const { user_id, category_id, title, img_asset, img_link } = req.body
      const { data, error } = await supabase.from('tb_assets').insert({
        user_id,
        category_id,
        title,
        img_asset,
        img_link
      })

      if (error) {
        throw new Error(error.message)
      }

      commonHelper.response(res, data, 201, 'assets saved successfully')
    } catch (error) {
      commonHelper.response(res, error, 500, 'Error while adding assets')
    }
  },
  updateAssetss: async (req, res) => {
    try {
      const { id } = req.params
      const { category_id, title, img_asset, img_link } = req.body

      // check if assets is existing
      const { data: existingData, error: existingDataError } = await supabase
        .from('tb_assets')
        .select('*')
        .eq('id', id)

      if (existingDataError) {
        return commonHelper.response(
          res,
          existingDataError.message,
          404,
          'assets not found'
        )
      }

      if (!existingData || existingData.length === 0) {
        return commonHelper.response(res, null, 404, 'assets not found')
      }

      const { error } = await supabase
        .from('tb_assets')
        .update({
          category_id,
          title,
          img_asset,
          img_link
        })
        .eq('id', id)

      if (error) {
        return commonHelper.response(res, error, 500, 'Error updating assets')
      }

      // Fetch the updated assets from the database
      const { data: updatedData, error: updatedDataError } = await supabase
        .from('tb_assets')
        .select('*')
        .eq('id', id)

      if (updatedDataError) {
        return commonHelper.response(
          res,
          updatedDataError.message,
          500,
          'Error getting updated assets'
        )
      }

      const data = {
        assetssData: updatedData[0],
        userData: null
      }

      commonHelper.response(res, data, 200, 'assets updated successfully')
    } catch (error) {
      commonHelper.response(res, error, 500, 'Error updating assets')
    }
  },
  getAllAssetss: async (req, res) => {
    try {
      const { page, limit } = req.query
      const currentPage = parseInt(page, 10) || 1
      const pageSize = parseInt(limit, 10) || 15
      const start = (currentPage - 1) * pageSize
      const end = start + pageSize - 1

      const { data, error } = await supabase
        .from('tb_assets')
        .select("'*'")
        .range(start, end)

      if (error) {
        throw new Error(error.message)
      }

      const { error: countError, count } = await supabase
        .from('tb_assets')
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
        'Success getting all assets',
        pagination
      )
    } catch (error) {
      commonHelper.response(res, null, 500, 'Error retrieving all assets')
    }
  },
  getAssetssById: async (req, res) => {
    try {
      const { id } = req.params
      const { data: assetssData, error: agentError } = await supabase
        .from('tb_assets')
        .select('*')
        .eq('id', id)
        .single()

      if (agentError) {
        return commonHelper.response(
          res,
          agentError.message,
          404,
          'Assets not found'
        )
      }

      commonHelper.response(res, assetssData, 200, 'Success getting assets')
    } catch (error) {
      commonHelper.response(res, error, 500, 'Error getting assets')
    }
  },
  deleteAssetss: async (req, res) => {
    try {
      const { id } = req.params

      const { data: existingData, error: existingDataError } = await supabase
        .from('tb_assets')
        .select('id')
        .eq('id', id)

      if (existingDataError) {
        throw new Error(existingDataError.message)
      }

      if (!existingData || existingData.length === 0) {
        return commonHelper.response(res, null, 404, 'assets not found')
      }

      const { error: deleteError } = await supabase
        .from('tb_assets')
        .delete()
        .eq('id', id)

      if (deleteError) {
        throw new Error(deleteError.message)
      }

      commonHelper.response(res, null, 200, 'assets deleted successfully')
    } catch (error) {
      commonHelper.response(res, error, 500, 'Error while deleting assets')
    }
  }
}

module.exports = assetsController
