export const settingCookie = (res, token) => {
  if (!token) {
    throw new Error(' token are required for setting cookie.')
  }

  res.cookie('jwt', token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV !== 'development' // Use secure cookies in production
  })
}
