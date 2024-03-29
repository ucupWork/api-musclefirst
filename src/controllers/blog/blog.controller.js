const { supabase } = require('../../config/db')
const commonHelper = require('../../helper/common')

const postsController = {
  createData: async (req, res) => {
    try {
      const {
        user_id,
        title,
        slug,
        category,
        img_blog,
        hashtag,
        summary,
        description
      } = req.body

      // let img_blog = null
      // if (req.file) {
      //   const result = await cloudinary.uploadToCloudinary(req.file.path)
      //   img_blog = result.secure_url
      // }

      const slugFormat = slug.toLowerCase().replace(/ /g, '-')
      const { data, error } = await supabase.from('tb_blog').insert({
        user_id,
        title,
        slug: slugFormat,
        img_blog,
        category,
        hashtag,
        summary,
        description
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
        title,
        img_blog,
        category,
        hashtag,
        summary,
        description,
        created_at
      } = req.body

      // check if Data is existing
      const { data: existingData, error: existingDataError } = await supabase
        .from('tb_blog')
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
        .from('tb_blog')
        .update({
          title,
          img_blog,
          category,
          hashtag,
          summary,
          description,
          created_at
        })
        .eq('id', id)

      if (error) {
        return commonHelper.response(res, error, 500, 'Error updating Data')
      }

      // Fetch the updated Data from the database
      const { data: updatedData, error: updatedDataError } = await supabase
        .from('tb_blog')
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
        fetchData: updatedData[0],
        userData: null
      }

      commonHelper.response(res, data, 200, 'Data updated successfully')
    } catch (error) {
      commonHelper.response(res, error, 500, 'Error updating Data')
    }
  },
  getAllData: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('tb_blog')
        .select('*, tb_users (id, username, email)')

      if (error) {
        throw new Error(error.message)
      }

      commonHelper.response(res, data, 200, 'Success getting all data', data)
    } catch (error) {
      commonHelper.response(res, null, 500, 'Error retrieving all data')
    }
  },
  getPagiDataFunfact: async (req, res) => {
    try {
      const { page, limit } = req.query
      const currentPage = parseInt(page, 10) || 1
      const pageSize = parseInt(limit, 10) || 5
      const start = (currentPage - 1) * pageSize
      const end = start + pageSize - 1

      const { data, error } = await supabase
        .from('tb_blog')
        .select('*')
        .eq('category', 'Funfact')
        .range(start, end)

      if (error) {
        throw new Error(error.message)
      }
      const { error: countError, count } = await supabase
        .from('tb_blog')
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
      console.error('Error:', error)
      commonHelper.response(res, null, 500, 'Error retrieving all data')
    }
  },
  getAllDataFunfact: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('tb_blog')
        .select('*')
        .eq('category', 'Funfact')

      if (error) {
        throw new Error(error.message)
      }

      commonHelper.response(res, data, 200, 'Success getting all data', data)
    } catch (error) {
      console.error('Error:', error)
      commonHelper.response(res, null, 500, 'Error retrieving all data')
    }
  },
  getPagiDataInfo: async (req, res) => {
    try {
      const { page, limit } = req.query
      const currentPage = parseInt(page, 10) || 1
      const pageSize = parseInt(limit, 10) || 5
      const start = (currentPage - 1) * pageSize
      const end = start + pageSize - 1

      const { data, error } = await supabase
        .from('tb_blog')
        .select('*, tb_users (id, username, email)')
        .range(start, end)
        .eq('category', 'Informasi')

      if (error) {
        throw new Error(error.message)
      }

      const { error: countError, count } = await supabase
        .from('tb_blog')
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
  getAllDataInfo: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('tb_blog')
        .select('*, tb_users (id, username, email)')
        .eq('category', 'Informasi')

      if (error) {
        throw new Error(error.message)
      }

      commonHelper.response(res, data, 200, 'Success getting all data', data)
    } catch (error) {
      commonHelper.response(res, null, 500, 'Error retrieving all data')
    }
  },
  getPagiDataRek: async (req, res) => {
    try {
      const { page, limit } = req.query
      const currentPage = parseInt(page, 10) || 1
      const pageSize = parseInt(limit, 10) || 5
      const start = (currentPage - 1) * pageSize
      const end = start + pageSize - 1

      const { data, error } = await supabase
        .from('tb_blog')
        .select('*, tb_users (id, username, email)')
        .range(start, end)
        .eq('category', 'Rekomendasi')

      if (error) {
        throw new Error(error.message)
      }

      const { error: countError, count } = await supabase
        .from('tb_blog')
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
  getAllDataRek: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('tb_blog')
        .select('*, tb_users (id, username, email)')
        .eq('category', 'Rekomendasi')

      if (error) {
        throw new Error(error.message)
      }

      commonHelper.response(res, data, 200, 'Success getting all data', data)
    } catch (error) {
      commonHelper.response(res, null, 500, 'Error retrieving all data')
    }
  },
  getSingleDataById: async (req, res) => {
    try {
      const { id } = req.params
      const { data: fetchData, error: fetchError } = await supabase
        .from('tb_blog')
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

      commonHelper.response(res, fetchData, 200, 'Success getting data')
    } catch (error) {
      commonHelper.response(res, error, 500, 'Error getting data')
    }
  },
  deleteData: async (req, res) => {
    try {
      const { id } = req.params

      const { data: existingData, error: existingDataError } = await supabase
        .from('tb_blog')
        .select('id')
        .eq('id', id)

      if (existingDataError) {
        throw new Error(existingDataError.message)
      }

      if (!existingData || existingData.length === 0) {
        return commonHelper.response(res, null, 404, 'Data not found')
      }

      const { error: deleteError } = await supabase
        .from('tb_blog')
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

module.exports = postsController
