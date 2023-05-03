var test = "hello world";
var buffer = buffer_create(0, buffer_grow, 1);
buffer_write(buffer, buffer_string, test);
buffer_save(buffer, "test.txt");