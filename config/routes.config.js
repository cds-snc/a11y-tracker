// 1) add your route(s) here ⬇️
const routes = [
  { name: 'start', path: { en: '/start', fr: '/debut' } },
  { name: 'scans', path: { en: '/scans', fr: '/scans' } },
  { name: 'api' },
  { name: 'seed-data'},
]

const locales = ['en', 'fr']

// note: you can define and export a custom configRoutes function here
// see route.helpers.js which is where the default one is defined
// if configRoutes is defined here it will be used in pacle of the default

module.exports = {
  routes,
  locales,
}
