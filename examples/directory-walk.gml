function walk_directory(dir, callback) {
  var files = [];
  var file_name = file_find_first(dir + "/*", fa_directory);

  while (file_name != "") {
    array_push(files, file_name);
    file_name = file_find_next();
  }

  file_find_close();

  for (var i = 0; i < array_length(files); i++) {
    var fullPath = dir + "/" + files[i];

    if (directory_exists(fullPath)) {
      walk_directory(fullPath, callback);
    } else {
      callback(fullPath);
    }
  }
}

// Show a debug message for every file in this folder
walk_directory(working_directory, function(filePath) {
  show_debug_message(filePath);
});