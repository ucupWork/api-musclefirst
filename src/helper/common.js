const response = (res, result, status, message, pagination, tokens) => {
  const resultPrint = {
    status: 'success',
    statusCode: status,
    data: result,
    message: message || null,
    pagination: pagination || {}
  }

  if (tokens) {
    const { accessToken, refreshToken } = tokens
    res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 3600000 })
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 604800000
    })
  }
  res.status(status).json(resultPrint)
}

module.exports = {
  response
}
