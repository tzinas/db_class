module.exports = {
  async redirects() {
    return [
      {
        source: '/entities',
        destination: '/entities/organization',
        permanent: false,
      },
      {
        source: '/queries',
        destination: '/queries/3.1',
        permanent: false,
      },
      {
        source: '/',
        destination: '/entities',
        permanent: false,
      }
    ]
  },
}
