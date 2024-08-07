const { supabase } = require('../../config/db')
const commonHelper = require('../../helper/common')
const cloudinary = require('../../middleware/cloudinary')

const recipesController = {
  createData: async (req, res) => {
    try {
      const {
        user_id,
        title,
        slug,
        category,
        calories,
        protein,
        recipe_ingredients,
        hashtag,
        summary,
        video_link
      } = req.body

      // Ensure req.file is properly populated with the uploaded file
      if (!req.file) {
        throw new Error('No file uploaded')
      }

      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path)
      const img_recipe = result.secure_url

      const slugFormat = slug.toLowerCase().replace(/ /g, '-')
      const { data, error } = await supabase.from('tb_recipes').insert({
        user_id,
        title,
        slug: slugFormat,
        category,
        calories,
        protein,
        recipe_ingredients,
        img_recipe,
        hashtag,
        summary,
        video_link
      })

      if (error) {
        throw new Error(error.message)
      }

      // Send success response
      commonHelper.response(res, data, 201, 'Data saved successfully')
    } catch (error) {
      // Send error response
      console.log(error)
      commonHelper.response(res, error, 500, 'Error while adding data')
    }
  },
  updateData: async (req, res) => {
    try {
      const { id } = req.params
      const {
        title,
        category,
        calories,
        protein,
        recipe_ingredients,
        img_recipe,
        hashtag,
        summary,
        video_link
      } = req.body

      // check if Data is existing
      const { data: existingData, error: existingDataError } = await supabase
        .from('tb_recipes')
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
        .from('tb_recipes')
        .update({
          title,
          slug,
          category,
          calories,
          protein,
          recipe_ingredients,
          img_recipe,
          hashtag,
          summary,
          video_link
        })
        .eq('id', id)

      if (error) {
        return commonHelper.response(res, error, 500, 'Error updating Data')
      }

      // Fetch the updated Data from the database
      const { data: updatedData, error: updatedDataError } = await supabase
        .from('tb_recipes')
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
        .from('tb_recipes')
        .select('*, tb_users (id, username, email)')
        .range(start, end)

      if (error) {
        throw new Error(error.message)
      }

      const { error: countError, count } = await supabase
        .from('tb_recipes')
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
      const { data: assetssData, error: fetchError } = await supabase
        .from('tb_recipes')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) {
        return commonHelper.response(
          res,
          fetchError.message,
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
        .from('tb_recipes')
        .select('id')
        .eq('id', id)

      if (existingDataError) {
        throw new Error(existingDataError.message)
      }

      if (!existingData || existingData.length === 0) {
        return commonHelper.response(res, null, 404, 'Data not found')
      }

      const { error: deleteError } = await supabase
        .from('tb_recipes')
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

module.exports = recipesController
