export default config =
    map: \linked
    plugins:
          * plugin: import \livescript-transform-esm/lib/plugin
            config: format: \cjs
          * plugin: import \livescript-transform-object-create
          * plugin: import \livescript-transform-top-level-await/lib/plugin
          * plugin: import \livescript-transform-implicit-async
          ...
