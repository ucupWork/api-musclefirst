const { supabase } = require('../../config/db')
const commonHelper = require('../../helper/common')
const blogModel = require('../../model/blog/blog.model')

const blogController = {
  createData: async (req, res) => {
    try {
      const {
        user_id,
        title,
        slug,
        category,
        keywords,
        quotes,
        description,
        meta_description
      } = req.body

      const descFormat = description.replace('&lt;', '<')
      const slugFormat = slug.toLowerCase().replace(/ /g, '-')

      // Check if the slug already exists
      const existingBlog = await blogModel.findSlugBlog(slugFormat)
      if (existingBlog) {
        return commonHelper.response(
          res,
          { error: 'Slug already exists. Please use a different slug.' },
          400,
          'Slug already exists. Please use a different slug.'
        )
      }

      const file = req.file
      if (!file) {
        return commonHelper.response(res, {}, 400, 'Image file is required.')
      }

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(file.originalname, file.buffer, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        throw new Error(uploadError.message)
      }

      // Get the public URL of the uploaded image
      const imgLink = `${process.env.SUPABASE_URL}/storage/v1/object/public/blog-images/${file.originalname}`

      const { data, error } = await supabase.from('tb_blog').insert({
        user_id,
        title,
        slug: slugFormat,
        img_blog: imgLink,
        category,
        keywords,
        quotes,
        description: descFormat,
        meta_description,
        created_at: new Date()
      })

      if (error) {
        throw new Error(error.message)
      }

      commonHelper.response(res, data, 201, 'Data saved successfully')
    } catch (error) {
      console.error('Error creating blog post:', error)
      commonHelper.response(res, error, 500, error.message)
    }
  },
  updateData: async (req, res) => {
    // still have bug
    try {
      const { id } = req.params
      const {
        title,
        category,
        keywords,
        quotes,
        description,
        meta_description
      } = req.body

      // const descFormat = description.replace('&lt;', '<')

      // Check if the blog post exists
      const { data: existingBlog, error: existingBlogError } = await supabase
        .from('tb_blog')
        .select('*')
        .eq('id', id)

      if (existingBlogError) {
        return commonHelper.response(
          res,
          existingBlogError.message,
          404,
          'Blog not found'
        )
      }

      if (!existingBlog || existingBlog.length === 0) {
        return commonHelper.response(res, null, 404, 'Blog not found')
      }

      // Update the blog post
      const { error } = await supabase
        .from('tb_blog')
        .update({
          title,
          category,
          keywords,
          quotes,
          description,
          meta_description
        })
        .eq('id', id)

      if (error) {
        throw new Error(error.message)
      }

      // Fetch the updated blog post from the database
      const { data: updatedBlog, error: fetchError } = await supabase
        .from('tb_blog')
        .select('*')
        .eq('id', id)

      if (fetchError || !updatedBlog || updatedBlog.length === 0) {
        return commonHelper.response(
          res,
          fetchError.message,
          500,
          'Error fetching updated blog'
        )
      }

      commonHelper.response(
        res,
        updatedBlog[0],
        200,
        'Blog updated successfully'
      )
    } catch (error) {
      console.error('Error updating blog post:', error)
      commonHelper.response(res, error, 500, 'Error updating blog')
    }
  },
  getAllData: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('tb_blog')
        .select('*, tb_users (*)')
        .order('created_at', { ascending: false }) // Order by created_at in descending order
      if (error) {
        throw new Error(error.message)
      }
      commonHelper.response(res, data, 200, 'Success getting all data', data)
    } catch (error) {
      console.error('Error retrieving all data:', error.message)
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
        .select('*, tb_users (*)')
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
        .select('*, tb_users (*)')
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
        .select('*, tb_users (*)')
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
        .select('*, tb_users (*)')
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
        .select('*, tb_users (*)')
        .eq('id', id)

      if (fetchError || !fetchData || fetchData === 0) {
        return commonHelper.response(
          res,
          fetchError.message,
          404,
          'Data not found'
        )
      }

      commonHelper.response(res, fetchData[0], 200, 'Success getting data')
    } catch (error) {
      commonHelper.response(res, error, 500, 'Error getting data')
    }
  },
  getByCategories: async (req, res) => {
    try {
      const { category } = req.params

      const { data, error } = await supabase
        .from('tb_blog')
        .select('*, tb_users (*)')
        .eq('category', category)

      if (error) {
        throw new Error(error.message)
      }

      commonHelper.response(res, data, 200, 'Success getting all data', data)
    } catch (error) {
      commonHelper.response(res, null, 500, 'Error retrieving all data')
    }
  },
  getBySlug: async (req, res) => {
    try {
      const { slug } = req.params

      const { data: fetchData, error: fetchError } = await supabase
        .from('tb_blog')
        .select('*, tb_users (*)')
        .eq('slug', slug)

      if (fetchError || !fetchData || fetchData === 0) {
        return commonHelper.response(
          res,
          fetchError.message,
          404,
          'Data not found'
        )
      }

      commonHelper.response(res, fetchData[0], 200, 'Success getting data')
    } catch (error) {
      commonHelper.response(res, error, 500, 'Error getting data')
    }
  },
  deleteData: async (req, res) => {
    try {
      const { id } = req.params

      // Find the blog post to get the image link
      const { data: blogData, error: blogError } = await supabase
        .from('tb_blog')
        .select('img_blog')
        .eq('id', id)
        .single()

      if (blogError || !blogData) {
        return commonHelper.response(
          res,
          blogError || { error: 'Blog not found' },
          404,
          'Blog not found'
        )
      }

      const imgLink = blogData.img_blog

      // Extract the file name from the imgLink
      const fileName = imgLink.split('/').pop()

      // Delete the blog post from the database
      const { data, error } = await supabase
        .from('tb_blog')
        .delete()
        .eq('id', id)

      if (error) {
        throw new Error(error.message)
      }

      // Delete the image from storage
      const { error: deleteError } = await supabase.storage
        .from('blog-images')
        .remove([fileName])

      if (deleteError) {
        throw new Error(deleteError.message)
      }

      commonHelper.response(res, data, 200, 'Data deleted successfully')
    } catch (error) {
      console.error('Error deleting blog post:', error)
      commonHelper.response(res, error, 500, error.message)
    }
  }
}

module.exports = blogController
