var gutil = require('gulp-util');
var PluginError = require('gulp-util/lib/PluginError');
var bootsie = require('bootsie');
var gulpmatch = require('gulp-match');
var plugin_name = "gulp-bootsie";
var through2 = require('through2');

var build_module = function(conf_file){
    if (!conf_file) throw new PluginError(plugin_name, 'Missing file option for '+plugin_name);
    var bootsie_compiler = bootsie(conf_file);

    var __json_condition = "*.json";
    var __build = function(){

        var compiled_files = [];

        var pass = through2.obj(function (file, enc, callback) {
            if (!gulpmatch(file, __json_condition)) {
                this.push(file);
            }else {
                compiled_files = bootsie_compiler.build_from_buffer(file.contents, {stream:true});
                for (var i =0; i<compiled_files.length; i++){
                    this.push(new gutil.File(
                            {
                                //cwd: compiled_files[i].cwd,
                                //base: compiled_files[i].base,
                                path: compiled_files[i].path,
                                contents: new Buffer(compiled_files[i].contents)
                            })
                    );
                }

            }
            callback();
        });
        return pass;
    };

    return {
        build: __build
    };
};

module.exports = build_module;