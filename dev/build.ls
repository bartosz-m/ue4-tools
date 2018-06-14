config = import \../src/.compiler.config
# loading livescript-transform resets all loaded plugins in cjs mode
# we need to import all files that we need before we import livescript-system
import
    \livescript-system

output-path = './lib'

livescript-system
    ..watch = true
    ..clean = true
    ..lib-path = output-path
    ..config = config
    ..build!
