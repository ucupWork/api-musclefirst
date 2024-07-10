const { supabase } = require('../../config/db')

const blogModel = {
  findSlugBlog: async (slug) => {
    try {
      const { data, error } = await supabase
        .from('tb_blog')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      return data
    } catch (error) {
      console.error('Error finding duplicate slug:', error)
      throw error
    }
  },
  findSlugRecipe: async (slug) => {
    try {
      const { data, error } = await supabase
        .from('tb_recipes')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      return data
    } catch (error) {
      console.error('Error finding duplicate slug:', error)
      throw error
    }
  }
}

module.exports = blogModel
