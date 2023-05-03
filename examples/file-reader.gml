// This script is meant to be run by dropping a file onto it.
// It will display the contents of the file and wait for the user to type any key.

// If there are no parameters, the user tried to just double click the program
if (parameter_count() <= 0) {
  show_debug_message("Invalid use: Drop a file onto this executable!");
} else {
  // Get the last parameter, which is the file path
  var file_path = parameter_string(parameter_count() - 1);

  // Load the file into a buffer and read it as a string
  var buffer = buffer_load(file_path);
  var contents = buffer_read(buffer, buffer_string);

  // Display the contents of the file if its size is less than 100000 bytes
  if (buffer_get_size(buffer) > 100000) {
    show_debug_message("File is too large to display!");
  } else {
    show_debug_message(contents);
  }
}

// Wait for the user to press any key before exiting the program
wait_for_exit();