import
    \atom : { CompositeDisposable }
    \cson
    \fs-extra : fs
    \path
    \process
    
delay = (t) -> new Promise (resolve) !-> set-timeout resolve,t

module.exports =
    activate: (state) ->
        console.log "UE4 tools activated"
        @subscriptions = new CompositeDisposable!
            ..add atom.commands.add \atom-workspace,
                'ue4-tools:import-vscode-settings': @~import-vscode-settings
        console.log \ok
        atom-package-deps = await async import \atom-package-deps
            return ..install \ue4-tools, true
                
    deactivate: !->
    
    /** Import settings from vscode to atom-clang plugin */
    import-vscode-settings: !->
        try
            settings-path = path.join atom.project.get-paths!0, \.vscode \c_cpp_properties.json
            vscode-settings = await fs.read-json settings-path
            [configuration, ...] = vscode-settings.configurations
            
            # changes to settings made through
            projects-settings-path = path.join process.env.HOME, \.atom \projects.cson
            projects-settings = cson.parse await fs.read-file projects-settings-path, \utf8
            project-settings = projects-settings.filter (.title == @project.title) .0
            project-settings{}settings{}'*'{}'atom-clang'defaultCXXFlags = []
                for include in configuration.include-path
                    ..push "-I#{include}"
                for define in configuration.defines
                    ..push "-D#{define}"
            fs.output-file projects-settings-path, cson.stringify projects-settings
        catch
            console.error e
            
    on-project-change: (@project) !->
        
    consume-projects: (@projects) !->
        @subscriptions.add projects.get-project @~on-project-change