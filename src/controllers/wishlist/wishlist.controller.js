const { supabase } = require('../../config/db')
const commonHelper = require('../../helper/common')

const wishlistController = {
  createData: async (req, res) => {
    try {
      const {
        user_id,
        wish_product_code,
        wish_product_url,
        wish_flavor_code,
        wish_size_code,
        wish_img_url,
        wish_name,
        wish_flavor,
        wish_size_number,
        wish_size_type,
        wish_price,
        wish_qty
      } = req.body
      const { data, error } = await supabase.from('tb_wishlist').insert({
        user_id,
        wish_product_code,
        wish_product_url,
        wish_flavor_code,
        wish_size_code,
        wish_img_url,
        wish_name,
        wish_flavor,
        wish_size_number,
        wish_size_type,
        wish_price,
        wish_qty
      })

      if (error) {
        throw new Error(error.message)
      }

      commonHelper.response(res, data, 201, 'Data saved successfully')
    } catch (error) {
      commonHelper.response(res, error, 500, 'Error while adding data')
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
        .from('tb_wishlist')
        .select("'*'")
        .range(start, end)

      if (error) {
        throw new Error(error.message)
      }

      const { error: countError, count } = await supabase
        .from('tb_wishlist')
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
  deleteData: async (req, res) => {
    try {
      const { id } = req.params

      const { data: existingData, error: existingDataError } = await supabase
        .from('tb_wishlist')
        .select('id')
        .eq('id', id)

      if (existingDataError) {
        throw new Error(existingDataError.message)
      }

      if (!existingData || existingData.length === 0) {
        return commonHelper.response(res, null, 404, 'Data not found')
      }

      const { error: deleteError } = await supabase
        .from('tb_wishlist')
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

module.exports = wishlistController
