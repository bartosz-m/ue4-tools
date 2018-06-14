var { CompositeDisposable } = require('atom');
var cson = (require('cson')['__default__'] || require('cson'));
var fs = (require('fs-extra')['__default__'] || require('fs-extra'));
var path = (require('path')['__default__'] || require('path'));
var process = (require('process')['__default__'] || require('process'));
(function(){
  var delay;
  delay = function(t){
    return new Promise(function(resolve){
      setTimeout(resolve, t);
    });
  };
  module.exports = {
    activate: async function(state){
      var x$, y$, atomPackageDeps;
      console.log("UE4 tools activated");
      x$ = this.subscriptions = new CompositeDisposable();
      x$.add(atom.commands.add('atom-workspace', {
        'ue4-tools:import-vscode-settings': bind$(this, 'importVscodeSettings')
      }));
      console.log('ok');
      y$ = atomPackageDeps = (await Promise.resolve( require('atom-package-deps')['__default__'] || require('atom-package-deps') ));
      return y$.install('ue4-tools', true);
      return y$;
    },
    deactivate: function(){}
    /** Import settings from vscode to atom-clang plugin */,
    importVscodeSettings: async function(){
      var settingsPath, vscodeSettings, ref$, configuration, projectsSettingsPath, projectsSettings, projectSettings, x$, ref1$, i$, len$, include, define, e, this$ = this;
      try {
        settingsPath = path.join(atom.project.getPaths()[0], '.vscode', 'c_cpp_properties.json');
        vscodeSettings = (await fs.readJson(settingsPath));
        ref$ = vscodeSettings.configurations, configuration = ref$[0];
        projectsSettingsPath = path.join(process.env.HOME, '.atom', 'projects.cson');
        projectsSettings = cson.parse((await fs.readFile(projectsSettingsPath, 'utf8')));
        projectSettings = projectsSettings.filter(function(it){
          return it.title === this$.project.title;
        })[0];
        x$ = ((ref$ = (ref1$ = projectSettings.settings || (projectSettings.settings = {}))['*'] || (ref1$['*'] = {}))['atom-clang'] || (ref$['atom-clang'] = {})).defaultCXXFlags = [];
        for (i$ = 0, len$ = (ref$ = configuration.includePath).length; i$ < len$; ++i$) {
          include = ref$[i$];
          x$.push("-I" + include);
        }
        for (i$ = 0, len$ = (ref$ = configuration.defines).length; i$ < len$; ++i$) {
          define = ref$[i$];
          x$.push("-D" + define);
        }
        fs.outputFile(projectsSettingsPath, cson.stringify(projectsSettings));
      } catch (e$) {
        e = e$;
        console.error(e);
      }
    },
    onProjectChange: function(project){
      this.project = project;
    },
    consumeProjects: function(projects){
      this.projects = projects;
      this.subscriptions.add(projects.getProject(bind$(this, 'onProjectChange')));
    }
  };
  function bind$(obj, key, target){
    return function(){ return (target || obj)[key].apply(obj, arguments) };
  }
}).call(this);

//# sourceMappingURL=index.js.map
