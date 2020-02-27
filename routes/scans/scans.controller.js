module.exports = (app, route) => {
  const name = route.name

  route.draw(app).get(route.render())
}
