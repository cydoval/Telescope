Package.describe({
  summary: "Telescope Cal theme",
  version: '0.1.0',
  name: "telescope-theme-cal"
});

Package.onUse(function (api) {

  api.use(['fourseven:scss', 'telescope:theme-hubble'], ['client']);

  api.addFiles([
    	 // modules
      'lib/client/scss/modules/_accounts.scss',
      'lib/client/scss/modules/_comments.scss',
      'lib/client/scss/modules/_dialogs.scss',
      'lib/client/scss/modules/_nav.scss',
      'lib/client/scss/modules/_posts.scss',
      'lib/client/scss/modules/_user-profile.scss',

      // partials
      'lib/client/scss/partials/_colors.scss',
      'lib/client/scss/partials/_grid.scss',
      'lib/client/scss/partials/_mixins.scss',
      'lib/client/scss/partials/_tooltips.scss',
      'lib/client/scss/partials/_typography.scss',

      //dependencies
      'lib/client/scss/dependencies/_dependencies.scss',
      'lib/client/scss/dependencies/_foundation.scss',
      'lib/client/scss/dependencies/_navigation.scss',
      'lib/client/scss/dependencies/_typography.scss',
      'lib/client/scss/dependencies/_components.scss',
      'lib/client/scss/dependencies/_regions.scss',
      'lib/client/scss/dependencies/_responsive.scss',

      // screen
      'lib/client/scss/screen.scss'

    ], ['client']);

});