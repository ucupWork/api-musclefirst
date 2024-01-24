const { supabase } = require('../../config/db')
const commonHelper = require('../../helper/common')

const assetsCategoryController = {
  createAssetssCtg: async (req, res) => {
    try {
      const { ct_assets_name, slug } = req.body
      const { data, error } = await supabase
        .from('tb_asset_categories')
        .insert({
          ct_assets_name,
          slug
        })

      if (error) {
        throw new Error(error.message)
      }

      commonHelper.response(
        res,
        data,
        201,
        'assets category saved successfully'
      )
    } catch (error) {
      commonHelper.response(
        res,
        error,
        500,
        'Error while adding assets category'
      )
    }
  },
  updateAssetssCtg: async (req, res) => {
    try {
      const { id } = req.params
      const { ct_assets_name, slug } = req.body

      // check if assets category is existing
      const { data: existingAssetsCtg, error: existingAssetsCtgError } =
        await supabase.from('tb_asset_categories').select('*').eq('id', id)

      if (existingAssetsCtgError) {
        return commonHelper.response(
          res,
          existingAssetsCtgError.message,
          404,
          'assets category not found'
        )
      }

      if (!existingAssetsCtg || existingAssetsCtg.length === 0) {
        return commonHelper.response(
          res,
          null,
          404,
          'assets category not found'
        )
      }

      const { error } = await supabase
        .from('tb_asset_categories')
        .update({
          ct_assets_name,
          slug
        })
        .eq('id', id)

      if (error) {
        return commonHelper.response(
          res,
          error,
          500,
          'Error updating assets category'
        )
      }

      // Fetch the updated assets category from the database
      const { data: updatedAssetsCtg, error: updatedAssetsCtgError } =
        await supabase.from('tb_asset_categories').select('*').eq('id', id)

      if (updatedAssetsCtgError) {
        return commonHelper.response(
          res,
          updatedAssetsCtgError.message,
          500,
          'Error getting updated assets category'
        )
      }

      const data = {
        fetchData: updatedAssetsCtg[0],
        userData: null
      }

      commonHelper.response(
        res,
        data,
        200,
        'assets category updated successfully'
      )
    } catch (error) {
      commonHelper.response(res, error, 500, 'Error updating assets category')
    }
  },
  getAllAssetssCtg: async (req, res) => {
    try {
      const { page, limit } = req.query
      const currentPage = parseInt(page, 10) || 1
      const pageSize = parseInt(limit, 10) || 15
      const start = (currentPage - 1) * pageSize
      const end = start + pageSize - 1

      const { data, error } = await supabase
        .from('tb_asset_categories')
        .select("'*'")
        .range(start, end)

      if (error) {
        throw new Error(error.message)
      }

      const { error: countError, count } = await supabase
        .from('tb_asset_categories')
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
        'Success getting all assets category',
        pagination
      )
    } catch (error) {
      commonHelper.response(
        res,
        null,
        500,
        'Error retrieving all assets category'
      )
    }
  },
  getAssetssCtgById: async (req, res) => {
    try {
      const { id } = req.params
      const { data: fetchData, error: fetchError } = await supabase
        .from('tb_asset_categories')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) {
        return commonHelper.response(
          res,
          fetchError.message,
          404,
          'assets category not found'
        )
      }

      commonHelper.response(
        res,
        fetchData,
        200,
        'Success getting assets category'
      )
    } catch (error) {
      commonHelper.response(res, error, 500, 'Error getting assets category')
    }
  },
  deleteAssetssCtg: async (req, res) => {
    try {
      const { id } = req.params

      const { data: existingAssetsCtg, error: existingAssetsCtgError } =
        await supabase.from('tb_asset_categories').select('id').eq('id', id)

      if (existingAssetsCtgError) {
        throw new Error(existingAssetsCtgError.message)
      }

      if (!existingAssetsCtg || existingAssetsCtg.length === 0) {
        return commonHelper.response(
          res,
          null,
          404,
          'assets category not found'
        )
      }

      const { error: deleteError } = await supabase
        .from('tb_asset_categories')
        .delete()
        .eq('id', id)

      if (deleteError) {
        throw new Error(deleteError.message)
      }

      commonHelper.response(
        res,
        null,
        200,
        'assets category deleted successfully'
      )
    } catch (error) {
      commonHelper.response(
        res,
        error,
        500,
        'Error while deleting assets category'
      )
    }
  }
}

module.exports = assetsCategoryController
