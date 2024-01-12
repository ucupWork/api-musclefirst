const { supabase } = require('../../config/db')
const commonHelper = require('../../helper/common')

const addressController = {
  createAddress: async (req, res) => {
    try {
      const {
        person_name,
        addr_detail,
        addr_city,
        addr_note,
        addr_zip_cod,
        prd_is_active
      } = req.body
      const { data, error } = await supabase.from('tb_address').insert({
        person_name,
        addr_detail,
        addr_city,
        addr_note,
        addr_zip_cod,
        prd_is_active
      })

      if (error) {
        throw new Error(error.message)
      }

      commonHelper.response(res, data, 201, 'Address saved successfully')
    } catch (error) {
      commonHelper.response(res, error, 500, 'Error while adding Address')
    }
  },
  updateAddress: async (req, res) => {
    try {
      const { id } = req.params
      const {
        person_name,
        addr_detail,
        addr_city,
        addr_note,
        addr_zip_cod,
        prd_is_active
      } = req.body

      // check if address is existing
      const { data: existingAddress, error: existingAddressError } =
        await supabase.from('tb_address').select('*').eq('id', id)

      if (existingAddressError) {
        return commonHelper.response(
          res,
          existingAddressError.message,
          404,
          'Address not found'
        )
      }

      if (!existingAddress || existingAddress.length === 0) {
        return commonHelper.response(res, null, 404, 'Address not found')
      }

      const { error } = await supabase
        .from('tb_address')
        .update({
          person_name,
          addr_detail,
          addr_city,
          addr_note,
          addr_zip_cod,
          prd_is_active
        })
        .eq('id', id)

      if (error) {
        return commonHelper.response(res, error, 500, 'Error updating address')
      }

      // Fetch the updated address from the database
      const { data: updatedAddress, error: updatedAddressError } =
        await supabase.from('tb_address').select('*').eq('id', id)

      if (updatedAddressError) {
        return commonHelper.response(
          res,
          updatedAddressError.message,
          500,
          'Error getting updated address'
        )
      }

      const data = {
        addressData: updatedAddress[0],
        userData: null
      }

      commonHelper.response(res, data, 200, 'Address updated successfully')
    } catch (error) {
      commonHelper.response(res, error, 500, 'Error updating Address')
    }
  },
  getAllAddress: async (req, res) => {
    try {
      const { page, limit } = req.query
      const currentPage = parseInt(page, 10) || 1
      const pageSize = parseInt(limit, 10) || 15
      const start = (currentPage - 1) * pageSize
      const end = start + pageSize - 1

      const { data, error } = await supabase
        .from('tb_address')
        .select("'*'")
        .range(start, end)

      if (error) {
        throw new Error(error.message)
      }

      const { error: countError, count } = await supabase
        .from('tb_address')
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
        'Success getting all address',
        pagination
      )
    } catch (error) {
      commonHelper.response(res, null, 500, 'Error retrieving all Address')
    }
  },
  getAddressById: async (req, res) => {
    try {
      const { id } = req.params
      const { data: addressData, error: addressError } = await supabase
        .from('tb_address')
        .select('*')
        .eq('id', id)
        .single()

      if (addressError) {
        return commonHelper.response(
          res,
          addressError.message,
          404,
          'Address not found'
        )
      }

      commonHelper.response(res, addressData, 200, 'Success getting address')
    } catch (error) {
      commonHelper.response(res, error, 500, 'Error getting address')
    }
  },
  deleteAddress: async (req, res) => {
    try {
      const { id } = req.params

      const { data: existingAddress, error: existingAddressError } =
        await supabase.from('tb_address').select('id').eq('id', id)

      if (existingAddressError) {
        throw new Error(existingAddressError.message)
      }

      if (!existingAddress || existingAddress.length === 0) {
        return commonHelper.response(res, null, 404, 'Address not found')
      }

      const { error: deleteError } = await supabase
        .from('tb_address')
        .delete()
        .eq('id', id)

      if (deleteError) {
        throw new Error(deleteError.message)
      }

      commonHelper.response(res, null, 200, 'Address deleted successfully')
    } catch (error) {
      commonHelper.response(res, error, 500, 'Error while deleting Address')
    }
  }
}

module.exports = addressController
