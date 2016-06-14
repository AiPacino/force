{ extend } = require 'underscore'
Promise = require 'bluebird-q'

module.exports = (page) ->
  middleware:
    isLoggedIn: (req, res, next) ->
      unless req.user?
        return res.redirect page.paths.show

      next()

  get:
    landing: (req, res, next) ->
      page
        .get()
        .then (data) ->
          res.locals.sd.SHOW_PATH = page.paths.show
          res.render 'pages/landing/templates/index', extend data,
            paths: page.paths

        .catch next

    complete: (req, res, next) ->
      { user } = req
      { collectorProfile } = user.related()

      Promise
        .all [
          user.fetch()
          collectorProfile.fetch data:
            access_token: user.get 'accessToken'
        ]

        .then ->
          res.locals.sd.CURRENT_USER = user.toJSON()
          res.locals.sd.COLLECTOR_PROFILE = collectorProfile.toJSON()
          res.render 'pages/complete/templates/index'

        .catch next