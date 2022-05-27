module.exports = {
  async redirects() {
    return [
      {
        source: '/entities',
        destination: '/entities/organization',
        permanent: false,
      }
    ]
  },
}
