const { supabase } = require('../../config/db')
const commonHelper = require('../../helper/common')

const roleController = {
  createRole: async (req, res) => {
    try {
      const { role_name } = req.body
      const { data, error } = await supabase
        .from('tb_roles')
        .insert({ role_name })

      if (error) {
        throw new Error(error.message)
      }

      commonHelper.response(res, data, 201, 'Roles saved successfully')
    } catch (error) {
      commonHelper.response(res, error, 500, 'Error while adding roles')
    }
  },
  updateRole: async (req, res) => {
    try {
      const { id } = req.params
      const { role_name } = req.body

      // check if role is existing
      const { data: existingRole, error: existingRoleError } = await supabase
        .from('tb_roles')
        .select('*')
        .eq('id', id)

      if (existingRoleError) {
        return commonHelper.response(
          res,
          existingRoleError.message,
          404,
          'Role not found'
        )
      }

      if (!existingRole || existingRole.length === 0) {
        return commonHelper.response(res, null, 404, 'Role not found')
      }

      const { error } = await supabase
        .from('tb_roles')
        .update({ role_name })
        .eq('id', id)

      if (error) {
        return commonHelper.response(res, error, 500, 'Error updating role')
      }

      // Fetch the updated role from the database
      const { data: updatedRole, error: updatedRoleError } = await supabase
        .from('tb_roles')
        .select('*')
        .eq('id', id)

      if (updatedRoleError) {
        return commonHelper.response(
          res,
          updatedRoleError.message,
          500,
          'Error getting updated role'
        )
      }

      const data = {
        roleData: updatedRole[0],
        userData: null
      }

      commonHelper.response(res, data, 200, 'Role updated successfully')
    } catch (error) {
      commonHelper.response(res, error, 500, 'Error updating role')
    }
  },
  getAllRole: async (req, res) => {
    try {
      const { page, limit } = req.query
      const currentPage = parseInt(page, 10) || 1
      const pageSize = parseInt(limit, 10) || 15
      const start = (currentPage - 1) * pageSize
      const end = start + pageSize - 1

      const { data, error } = await supabase
        .from('tb_roles')
        .select("'*'")
        .range(start, end)

      if (error) {
        throw new Error(error.message)
      }

      const { error: countError, count } = await supabase
        .from('tb_roles')
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
        'Success getting all role',
        pagination
      )
    } catch (error) {
      commonHelper.response(res, null, 500, 'Error retrieving all roles')
    }
  },
  getRoleById: async (req, res) => {
    try {
      const { id } = req.params
      const { data: roleData, error: roleError } = await supabase
        .from('tb_roles')
        .select('*')
        .eq('id', id)
        .single()

      if (roleError) {
        return commonHelper.response(
          res,
          roleError.message,
          404,
          'Role not found'
        )
      }

      commonHelper.response(res, roleData, 200, 'Success getting role')
    } catch (error) {
      commonHelper.response(res, error, 500, 'Error getting role')
    }
  },
  deleteRole: async (req, res) => {
    try {
      const { id } = req.params

      const { data: existingRole, error: existingRoleError } = await supabase
        .from('tb_roles')
        .select('id')
        .eq('id', id)

      if (existingRoleError) {
        throw new Error(existingRoleError.message)
      }

      if (!existingRole || existingRole.length === 0) {
        return commonHelper.response(res, null, 404, 'Role not found')
      }

      const { error: deleteError } = await supabase
        .from('tb_roles')
        .delete()
        .eq('id', id)

      if (deleteError) {
        throw new Error(deleteError.message)
      }

      commonHelper.response(res, null, 200, 'Role deleted successfully')
    } catch (error) {
      commonHelper.response(res, error, 500, 'Error while deleting role')
    }
  }
}

module.exports = roleController
