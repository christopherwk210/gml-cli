const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const zlib = require('node:zlib');

// #region Interop

function __not_support(func) {
    throw new Error(`${func} is not supported.`);
}

function wait_for_exit() {
  console.log('Press any key to continue...');
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on('data', process.exit.bind(process, 0));
}

// #endregion

// #region Debugging

function show_debug_message(value_or_format, ...values) {
  show_debug_message_ext(value_or_format, values);
}

function show_debug_message_ext(value_or_format, values) {
  if (values.length === 0) {
    console.log(value_or_format);
  } else {
    let str = value_or_format;
    for (let i = 0; i < values.length; i++) {
      str = str.replace(`{${i}}`, values[i]);
    }
    console.log(str);
  }
}

function clear_debug_messages() {
  console.clear();
}

function debug_event(string, silent) {
  __not_support('debug_event()');
}

function debug_get_callstack() {
  console.trace();
}

function exception_unhandled_handler(user_handler) {
  process.on('uncaughtException', e => {
    user_handler({
      message: e.name,
      longMessage: e.message,
      script: '',
      line: -1,
      stacktrace: e.stack
    });
  });
}

function get_integer(str, def) {
  __not_support('get_integer()');
}

function get_string(str, def) {
  __not_support('get_string()');
}

function show_error(str, abort) {
  show_message(str);
  if (abort) process.exit(1);
}

function show_debug_overlay(enable) {
  __not_support('show_debug_overlay()');
}

function code_is_compiled() {
  return __code_is_compiled;
}

// #endregion

// #region Arrays

function array_create(size, values) {
  const arr = new Array(size);

  if (values !== undefined) {
    for (let i = 0; i < size; i++) {
      arr[i] = values;
    }
  }

  return arr;
}

function array_copy(dest, dest_index, src, src_index, length) {
  for (let i = 0; i < length; i++) {
    dest[dest_index + i] = src[src_index + i];
  }
}

function array_equals(var1, var2) {
  if (var1.length !== var2.length) return false;

  for (let i = 0; i < var1.length; i++) {
    if (var1[i] !== var2[i]) return false;
  }

  return true;
}

function array_get(variable, index) {
  return variable[index];
}

function array_set(variable, index, value) {
  variable[index] = value;
}

function array_push(variable, ...value) {
  variable.push(...value);
}

function array_pop(variable) {
  return variable.pop();
}

function array_insert(variable, index, ...value) {
  variable.splice(index, 0, ...value);
}

function array_delete(variable, index, number) {
  variable.splice(index, number);
}

function array_get_index(array, value, offset, length) {
  if (length !== undefined) __not_support('array_get_index() length parameter');
  return array.indexOf(value, offset);
}

function array_contains(array, value, offset, length) {
  if (length !== undefined) __not_support('array_contains() length parameter');
  return array.includes(value, offset);
}

function array_contains_ext(array, values, matchAll, offset, length) {
  if (length !== undefined) __not_support('array_contains_ext() length parameter');

  if (matchAll) {
    for (let i = 0; i < values.length; i++) {
      if (!array.includes(values[i], offset)) return false;
    }
  
    return true;
  } else {
    for (let i = 0; i < values.length; i++) {
      if (array.includes(values[i], offset)) return true;
    }
  
    return false;
  }
}

function array_sort(variable, sorttype_or_function) {
  if (typeof sorttype_or_function === 'function') {
    variable.sort(sorttype_or_function);
  } else {
    variable.sort();
  }
}

function array_reverse(array, offset, length) {
  if (offset !== undefined || length !== undefined) __not_support('array_reverse() offset or length parameter');
  array.reverse();
}

function array_shuffle(array, offset, length) {
  if (offset !== undefined || length !== undefined) __not_support('array_shuffle() offset or length parameter');
  array.sort(() => Math.random() - 0.5);
}

function array_length(array) {
  return array.length;
}

function array_resize(array, new_size) {
  array.length = new_size;
}

function array_first(array) {
  return array[0];
}

function array_last(array) {
  return array[array.length - 1];
}

function array_find_index(array, func, offset) {
  if (offset !== undefined || length !== undefined) __not_support('array_find_index() offset or length parameter');
  return array.findIndex(func);
}

function array_any(array, func, offset, length) {
  if (offset !== undefined || length !== undefined) __not_support('array_any() offset or length parameter');
  return array.some(func);
}

function array_all(array, func, offset, length) {
  if (offset !== undefined || length !== undefined) __not_support('array_all() offset or length parameter');
  return array.every(func);
}

function array_foreach(array, func, offset, length) {
  if (offset !== undefined || length !== undefined) __not_support('array_foreach() offset or length parameter');
  array.forEach(func);
}

function array_reduce(array, func, init, offset, length) {
  if (offset !== undefined || length !== undefined) __not_support('array_reduce() offset or length parameter');
  return array.reduce(func, init);
}

function array_concat(array1, array2, ...arrays) {
  return array1.concat(array2, ...arrays);
}

function array_union(array1, array2, ...arrays) {
  return [...new Set(array1.concat(array2, ...arrays))];
}

function array_intersection(array1, array2, ...arrays) {
  return array1.filter(value => array2.includes(value)).filter(value => arrays.every(array => array.includes(value)));
}

function array_filter(array, func, offset, length) {
  if (offset !== undefined || length !== undefined) __not_support('array_filter() offset or length parameter');
  return array.filter(func);
}

function array_map(array, func, offset, length) {
  if (offset !== undefined || length !== undefined) __not_support('array_map() offset or length parameter');
  return array.map(func);
}

function array_unique(array, offset, length) {
  if (offset !== undefined || length !== undefined) __not_support('array_unique() offset or length parameter');
  return [...new Set(array)];
}

function array_copy_while(array, func, offset, length) {
  if (offset !== undefined || length !== undefined) __not_support('array_copy_while() offset or length parameter');
  const output = [];
  while (func()) {
    output.push(array.shift());
  }
  return output;
}

function array_create_ext(size, func) {
  const output = [];
  for (let i = 0; i < size; i++) {
    output.push(func(i));
  }
  return output;
}

function array_filter_ext(array, func, offset, length) {
  __not_support('array_filter_ext');
}

function array_map_ext(array, func, offset, length) {
  __not_support('array_map_ext');
}

function array_unique_ext(array, func, offset, length) {
  __not_support('array_unique_ext');
}

function array_reverse_ext(array, func, offset, length) {
  __not_support('array_reverse_ext');
}

// #endregion

// #region Strings

function string(value_or_format, ...values) {
  return string_ext(value_or_format, values);
}

function string_ext(value_or_format, values) {
  if (values.length === 0) {
    return `${value_or_format}`;
  } else {
    let str = `${value_or_format}`;
    for (let i = 0; i < values.length; i++) {
      str = str.replace(`{${i}}`, values[i]);
    }
    return str;
  }
}

function ansi_char(val) {
  __not_support('ansi_char');
}

function chr(val) {
  return String.fromCharCode(val);
}

function ord(str) {
  return str.charCodeAt(0);
}

function real(str) {
  return parseFloat(str);
}

function string_byte_at(str, index) {
  return str.charCodeAt(index);
}

function string_byte_length(str) {
  return str.length;
}

function string_set_byte_at(str, pos, byte) {
  return str.substr(0, pos) + String.fromCharCode(byte) + str.substr(pos + 1);
}

function string_char_at(str, index) {
  return str.charAt(index);
}

function string_ord_at(str, index) {
  return str.charCodeAt(index);
}

function string_length(str) {
  return str.length;
}

function string_pos(substr, str) {
  return str.indexOf(substr);
}

function string_pos_ext(substr, str, start_pos) {
  return str.indexOf(substr, start_pos);
}

function string_last_pos(substr, str) {
  return str.lastIndexOf(substr);
}

function string_last_pos_ext(substr, str, start_pos) {
  return str.lastIndexOf(substr, start_pos);
}

function string_starts_with(str, substr) {
  return str.startsWith(substr);
}

function string_ends_with(str, substr) {
  return str.endsWith(substr);
}

function string_count(substr, str) {
  return str.split(substr).length - 1;
}

function string_copy(str, index, count) {
  return str.substr(index - 1, count);
}

function string_delete(str, index, count) {
  return str.substr(0, index - 1) + str.substr(index - 1 + count);
}

function string_digits(str) {
  return str.replace(/\D/g, '');
}

function string_format(val, tot, dec) {
  return val.toFixed(dec).padStart(tot, '0');
}

function string_insert(substr, str, index) {
  return str.substr(0, index - 1) + substr + str.substr(index - 1);
}

function string_letters(str) {
  return str.replace(/[^A-Za-z]/g, '');
}

function string_lettersdigits(str) {
  return str.replace(/[^A-Za-z0-9]/g, '');
}

function string_lower(str) {
  return str.toLowerCase();
}

function string_repeat(str, count) {
  return str.repeat(count);
}

function string_replace(str, substr, newstr) {
  return str.replace(substr, newstr);
}

function string_replace_all(str, substr, newstr) {
  return str.replaceAll(substr, newstr);
}

function string_upper(str) {
  return str.toUpperCase();
}

function string_hash_to_newline(str) {
  __not_support('string_hash_to_newline');
}

function string_trim(str) {
  return str.trim();
}

function string_trim_start(str) {
  return str.trimStart();
}

function string_trim_end(str) {
  return str.trimEnd();
}

function string_split(str, delimiter, remove_empty, max_splits) {
  if (remove_empty === undefined) remove_empty = false;
  if (max_splits === undefined) max_splits = -1;
  const output = str.split(delimiter, max_splits);
  if (remove_empty) {
    for (let i = output.length - 1; i >= 0; i--) {
      if (output[i] === '') output.splice(i, 1);
    }
  }
  return output;
}

function string_split_ext(str, delimiter, remove_empty, max_splits) {
  __not_support('string_split_ext()');
}

function string_join(delimiter, value1, ...values) {
  return string_join_ext(delimiter, [value1, ...values]);
}

function string_join_ext(delimiter, values, offset, length) {
  if (offset === undefined) offset = 0;
  if (length === undefined) length = values.length;
  return values.slice(offset, offset + length).join(delimiter);
}

function string_concat(value1, ...values) {
  return string_concat_ext([value1, ...values]);
}

function string_concat_ext(values, offset, length) {
  if (offset === undefined) offset = 0;
  if (length === undefined) length = values.length;
  return values.slice(offset, offset + length).join('');
}

function string_width(str) {
  return 0;
}

function string_width_ext(str, sep, w) {
  return 0;
}

function string_height(str) {
  return 0;
}

function string_height_ext(str, sep, w) {
  return 0;
}

function string_foreach(str, func, pos, length) {
  if (pos === undefined) pos = 0;
  if (length === undefined) length = str.length;
  for (let i = pos; i < pos + length; i++) {
    func(str.charAt(i), i);
  }
}

// #endregion

// #region Number Functions

function choose(...args) {
  return args[Math.floor(Math.random() * args.length)];
}

function random(n) {
  return Math.random() * n;
}

function random_rang(n1, n2) {
  return Math.random() * (n2 - n1) + n1;
}

function irandom(n) {
  return Math.floor(Math.random() * n);
}

function irandom_range(n1, n2) {
  return Math.floor(Math.random() * (n2 - n1) + n1);
}

function round(n) {
  return Math.round(n);
}

function floor(n) {
  return Math.floor(n);
}

function frac(n) {
  return n % 1;
}

function abs(n) {
  return Math.abs(n);
}

function sign(n) {
  return Math.sign(n);
}

function ceil(n) {
  return Math.ceil(n);
}

function max(...args) {
  return Math.max(...args);
}

function mean(...args) {
  return args.reduce((a, b) => a + b) / args.length;
}

function median(...args) {
  const sorted = args.sort();
  const mid = Math.ceil(args.length / 2);
  return args.length % 2 === 0 ? (sorted[mid] + sorted[mid - 1]) / 2 : sorted[mid - 1];
}

function min(...args) {
  return Math.min(...args);
}

function lerp(n1, n2, amount) {
  return n1 + (n2 - n1) * amount;
}

function clamp(n, n1, n2) {
  return Math.min(Math.max(n, n1), n2);
}

function exp(n) {
  return Math.exp(n);
}

function ln(n) {
  return Math.log(n);
}

function power(n, power) {
  return Math.pow(n, power);
}

function sqr(n) {
  return n * n;
}

function sqrt(n) {
  return Math.sqrt(n);
}

function log2(n) {
  return Math.log2(n);
}

function log10(n) {
  return Math.log10(n);
}

function logn(base, n) {
  return Math.log(n) / Math.log(base);
}

// #endregion

// #region Struct Functions

function variable_struct_exists(struct, name) {
  return name in struct;
}

function variable_struct_get(struct, name) {
  return struct[name];
}

function variable_struct_set(struct, name, value) {
  struct[name] = value;
}

function variable_struct_remove(struct, name) {
  delete struct[name];
}

function variable_struct_get_names(struct) {
  return Object.keys(struct);
}

function variable_struct_names_count(struct) {
  return Object.keys(struct).length;
}

// #endregion

// #region Methods

function method(struct_ref_or_instance_id, func) {
  return func.bind(struct_ref_or_instance_id);
}

function method_get_self(method) {
  __not_support('method_get_self');
}

function method_get_index(method) {
  __not_support('method_get_index');
}

function method_call(method, array_args, offset, length) {
  if (offset !== undefined || length !== undefined) __not_support('method_call() offset or length parameter');
  method.call(...array_args);
}

// #endregion

// #region Data Type Functions

const is_string = (value) => typeof value === 'string';
const is_real = (value) => typeof value === 'number';
const is_numeric = (value) => typeof value === 'number';
const is_bool = (value) => typeof value === 'boolean';
const is_array = (value) => Array.isArray(value);
const is_struct = (value) => typeof value === 'object' && !Array.isArray(value);
const is_method = (value) => typeof value === 'function';
const is_callable = (value) => typeof value === 'function';
const is_ptr = (value) => __not_support('is_ptr');
const is_int32 = (value) => Number.isInteger(value);
const is_int64 = (value) => Number.isInteger(value);
const is_undefined = (value) => typeof value === 'undefined';
const is_nan = (value) => Number.isNaN(value);
const is_infinity = (value) => value === Infinity || value === -Infinity;
const bool = (value) => !!value;
const ptr = (value) => __not_support('ptr');
const int64 = (value) => __not_support('int64');

// #endregion

// #region File Handling

// #region File Directories

function directory_exists(dname) {
  return fs.existsSync(dname) && fs.lstatSync(dname).isDirectory();
}

function directory_create(dname) {
  fs.mkdirSync(dname);
}

function directory_destroy(dname) {
  fs.rmdirSync(dname);
}

// #endregion

// #region File System

const fa_none = 0;
const fa_readonly = 1;
const fa_hidden = 2;
const fa_sysfile = 4;
const fa_volumeid = 8;
const fa_directory = 16;
const fa_archive = 32;

function file_exists(fname) {
  return fs.existsSync(fname);
}

function file_delete(fname) {
  fs.unlinkSync(fname);
}

function file_rename(oldname, newname) {
  fs.renameSync(oldname, newname);
}

function file_copy(fname, newname) {
  fs.copyFileSync(fname, newname);
}

let __last_dir_read = null;
let __last_dir_index = 0;

function file_find_first(mask, attr = 0) {
  const basePath = path.dirname(mask);
  const glob = path.basename(mask);
  const ext = path.extname(glob.toLowerCase());

  if (attr & fa_readonly) __not_support('file_find_first() fa_readonly');
  if (attr & fa_hidden) __not_support('file_find_first() fa_hidden');
  if (attr & fa_sysfile) __not_support('file_find_first() fa_sysfile');
  if (attr & fa_volumeid) __not_support('file_find_first() fa_volumeid');
  if (attr & fa_archive) __not_support('file_find_first() fa_archive');

  __last_dir_read = fs.readdirSync(basePath).filter(fname => {
    if (ext !== '' && path.extname(fname.toLowerCase()) !== ext) {
      return false;
    }

    const stat = fs.statSync(path.join(basePath, fname));
    if (stat.isDirectory() && !(attr & fa_directory)) return false;

    return true;
  });

  __last_dir_index = 0;

  return __last_dir_read[__last_dir_index];
}

function file_find_next() {
  __last_dir_index++;

  if (__last_dir_index >= __last_dir_read.length) return '';
  return __last_dir_read[__last_dir_index];
}

function file_find_close() {
  __last_dir_read = null;
  __last_dir_index = 0;
}

function file_attributes(fname, attr) {
  const stat = fs.statSync(fname);
  if (attr & fa_readonly) __not_support('file_attributes() fa_readonly');
  if (attr & fa_hidden) __not_support('file_attributes() fa_hidden');
  if (attr & fa_sysfile) __not_support('file_attributes() fa_sysfile');
  if (attr & fa_volumeid) __not_support('file_attributes() fa_volumeid');
  if (attr & fa_archive) __not_support('file_attributes() fa_archive');
  if (attr & fa_directory) return stat.isDirectory();
  return false;
}

function filename_name(fname) {
  return path.basename(fname);
}

function filename_path(fname) {
  return path.dirname(fname);
}

function filename_dir(fname) {
  return path.dirname(fname);
}

function filename_drive(fname) {
  return path.parse(fname).root;
}

function filename_ext(fname) {
  return path.extname(fname);
}

function filename_change_ext(fname, newext) {
  const ext = path.extname(fname);
  const newname = fname.replace(ext, newext);
  file_rename(fname, newname);
}

function get_open_filename(filter, fname) {
  __not_support('get_open_filename');
}

function get_open_filename_ext(filter, fname, directory, caption) {
  __not_support('get_open_filename_ext');
}

function get_save_filename(filter, fname) {
  __not_support('get_save_filename');
}

function get_save_filename_ext(filter, fname, directory, caption) {
  __not_support('get_save_filename_ext');
}

// #endregion

// #endregion

// #region Data Structures

const ds_type_map = 1;
const ds_type_list = 2;
const ds_type_stack = 3;
const ds_type_queue = 4;
const ds_type_grid = 5;
const ds_type_priority = 6;

// #region DS Maps

function ds_map_create() {
  return {};
}

function ds_map_exists(id, key) {
  return id.hasOwnProperty(key); 
}

function ds_map_add(id, key, val) {
  if (ds_map_exists(id, key)) return false;
  id[key] = val;
  return true;
}

function ds_map_clear(id) {
  for (const key in id) {
    delete id[key];
  }
}

function ds_map_copy(id, source) {
  ds_map_clear(id);
  for (const key in source) {
    id[key] = source[key];
  }
}

function ds_map_replace(id, key, val) {
  const exists = ds_map_exists(id, key);
  id[key] = val;
  return exists;
}

function ds_map_delete(id, key) {
  delete id[key];
}

function ds_map_empty(id) {
  return Object.keys(id).length === 0;
}

function ds_map_size(id) {
  return Object.keys(id).length;
}

function ds_map_find_first(id) {
  return Object.keys(id)[0];
}

function ds_map_find_last(id) {
  return Object.keys(id).pop();
}

function ds_map_find_next(id, key) {
  const keys = Object.keys(id);
  const index = keys.indexOf(key);
  return keys[index + 1];
}

function ds_map_find_previous(id, key) {
  const keys = Object.keys(id);
  const index = keys.indexOf(key);
  return keys[index - 1];
}

function ds_map_find_value(id, key) {
  return id[key];
}

function ds_map_keys_to_array(id, array) {
  if (array === undefined) {
    return Object.keys(id);
  } else {
    const keys = Object.keys(id);
    for (let i = 0; i < keys.length; i++) {
      array.push(keys[i]);
    }

    return array;
  }
}

function ds_map_values_to_array(id, array) {
  if (array === undefined) {
    return Object.values(id);
  } else {
    const keys = Object.keys(id);
    for (let i = 0; i < keys.length; i++) {
      array.push(id[keys[i]]);
    }

    return array;
  }
}

function ds_map_set(id, key, val) {
  id[key] = val;
}

function ds_map_read(id, str) {
  const data = JSON.parse(str);
  ds_map_copy(id, data);
}

function ds_map_write(id) {
  return JSON.stringify(id);
}

function ds_map_destroy(id) {
  ds_map_clear(id);
}

function ds_map_secure_save(map, filename) {
  __not_support('ds_map_secure_save');
}

function ds_map_secure_save_buffer(map, filename) {
  __not_support('ds_map_secure_save_buffer');
}

function ds_map_secure_load(map, filename) {
  __not_support('ds_map_secure_load');
}

function ds_map_secure_load_buffer(map, filename) {
  __not_support('ds_map_secure_load_buffer');
}

function ds_map_add_list(id, key, value) {
  id[key] = value;
}

function ds_map_add_map(id, key, value) {
  id[key] = value;
}

function ds_map_replace_list(id, key, value) {
  id[key] = value;
}

function ds_map_replace_map(id, key, value) {
  id[key] = value;
}

function ds_map_is_list(id, key) {
  return Array.isArray(id[key]);
}

function ds_map_is_map(id, key) {
  return typeof id[key] === 'object' && !Array.isArray(id[key]);
}

// #endregion

// #region DS Lists

function ds_list_create() {
  return [];
}

function ds_list_destroy(id) {
  ds_list_clear(id);
}

function ds_list_clear(id) {
  id.length = 0;
}

function ds_list_empty(id) {
  return id.length === 0;
}

function ds_list_size(id) {
  return id.length;
}

function ds_list_add(id, val1, ...vals) {
  id.push(val1, ...vals);
}

function ds_list_set(id, pos, val) {
  id[pos] = val;
}

function ds_list_delete(id, pos) {
  id.splice(pos, 1);
}

function ds_list_find_index(id, val) {
  return id.indexOf(val);
}

function ds_list_find_value(id, pos) {
  return id[pos];
}

function ds_list_insert(id, pos, val) {
  id.splice(pos, 0, val);
}

function ds_list_replace(id, pos, val) {
  id[pos] = val;
}

function ds_list_shuffle(id) {
  id.sort(() => Math.random() - 0.5);
}

function ds_list_sort(id, ascend) {
  id.sort((a, b) => ascend ? a - b : b - a);
}

function ds_list_copy(id, source) {
  ds_list_clear(id);
  for (let i = 0; i < source.length; i++) {
    id.push(source[i]);
  }
}

function ds_list_read(id, str) {
  const data = JSON.parse(str);
  ds_list_copy(id, data);
}

function ds_list_write(id) {
  return JSON.stringify(id);
}

function ds_list_mark_as_list(id, pos) {
  // no-op
}

function ds_list_mark_as_map(id, pos) {
  // no-op
}

function ds_list_is_list(id, pos) {
  return Array.isArray(id[pos]);
}

function ds_list_is_map(id, pos) {
  return typeof id[pos] === 'object' && !Array.isArray(id[pos]);
}

// #endregion

// #endregion

// #region Encoding And Hashing

function json_encode(map) {
  return JSON.stringify(map);
}

function json_decode(str) {
  return JSON.parse(str);
}

function json_stringify(val, pretty_print) {
  return JSON.stringify(val, null, pretty_print ? 2 : 0);
}

function json_parse(json) {
  return JSON.parse(json);
}

function base64_encode(str) {
  return btoa(str);
}

function base64_decode(str) {
  return atob(str);
}

function md5_string_utf8(str) {
  return crypto.createHash('md5').update(str, 'utf8').digest('hex');
}

function md5_string_unicode(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

function md5_file(filename) {
  const buff = fs.readFileSync(filename);
  return crypto.createHash('md5').update(buff).digest('hex');
}

function sha1_string_utf8(str) {
  return crypto.createHash('sha1').update(str, 'utf8').digest('hex');
}

function sha1_string_unicode(str) {
  return crypto.createHash('sha1').update(str).digest('hex');
}

function sha1_file(filename) {
  const buff = fs.readFileSync(filename);
  return crypto.createHash('sha1').update(buff).digest('hex');
}

function zip_unzip(zip_file, target_directory) {
  __not_support('zip_unzip');
}

function load_csv(filename) {
  __not_support('load_csv');
}

// #endregion

// #region Buffers

const buffer_fixed = 0;
const buffer_grow = 1;
const buffer_wrap = 2;
const buffer_fast = 3;
const buffer_vbuffer = 4;

const buffer_u8 = 1;
const buffer_s8 = 2;
const buffer_u16 = 3;
const buffer_s16 = 4;
const buffer_u32 = 5;
const buffer_s32 = 6;
const buffer_u64 = 7;
const buffer_f16 = 8;
const buffer_f32 = 9;
const buffer_f64 = 10;
const buffer_bool = 11;
const buffer_string = 12;
const buffer_text = 13;

const buffer_seek_start = 0;
const buffer_seek_relative = 1;
const buffer_seek_end = 2;

class __GM_BUFFER {
  constructor(size, type, alignment) {
    if (alignment !== 1) __not_support('All buffers have an alignment of 1, buffer alignment')

    this.size = size;
    this.type = type;
    this.data = Buffer.alloc(size);
    this.current_seek = 0;

    if (this.type === buffer_wrap) {
      __not_support('buffer_wrap');
    }
  }

  read(type) {
    switch (type) {
      case buffer_u8:
        return this.data.readUInt8(this.current_seek++);
      case buffer_s8:
        return this.data.readInt8(this.current_seek++);
      case buffer_u16:
        const u16 = this.data.readUInt16LE(this.current_seek);
        this.current_seek += 2;
        return u16;
      case buffer_s16:
        const s16 = this.data.readInt16LE(this.current_seek);
        this.current_seek += 2;
        return s16;
      case buffer_u32:
        const u32 = this.data.readUInt32LE(this.current_seek);
        this.current_seek += 4;
        return u32;
      case buffer_s32:
        const s32 = this.data.readInt32LE(this.current_seek);
        this.current_seek += 4;
        return s32;
      case buffer_u64:
        const u64 = this.data.readBigUInt64LE(this.current_seek);
        this.current_seek += 8;
        return u64;
      case buffer_f16:
        const f16 = this.data.readFloatLE(this.current_seek);
        this.current_seek += 4;
        return f16;
      case buffer_f32:
        const f32 = this.data.readFloatLE(this.current_seek);
        this.current_seek += 4;
        return f32;
      case buffer_f64:
        const f64 = this.data.readDoubleLE(this.current_seek);
        this.current_seek += 8;
        return f64;
      case buffer_bool:
        return this.data.readUInt8(this.current_seek++) === 1;
      case buffer_string:
        const str = this.data.toString('utf8', this.current_seek);
        this.current_seek += str.length + 1;
        return str;
      case buffer_text:
        const text = this.data.toString('utf8', this.current_seek);
        this.current_seek += text.length + 1;
        return text;
    }
  }

  write(type, val) {
    let nextSize = 1;
    switch (type) {
      case buffer_bool:
      case buffer_u8:
      case buffer_s8:
        nextSize = 1;
        break;
      case buffer_u16:
      case buffer_s16:
      case buffer_f16:
        nextSize = 2;
        break;
      case buffer_u32:
      case buffer_s32:
      case buffer_f32:
        nextSize = 4;
        break;
      case buffer_u64:
      case buffer_f64:
        nextSize = 8;
        break;
      case buffer_string:
      case buffer_text:
        nextSize = val.length;
        break;
    }

    if (this.type === buffer_grow && this.current_seek + nextSize >= this.size) {
      this.size += nextSize;
      this.data = Buffer.concat([this.data, Buffer.alloc(nextSize)]);
    }

    switch (type) {
      case buffer_u8:
        this.data.writeUInt8(val, this.current_seek++);
        break;
      case buffer_s8:
        this.data.writeInt8(val, this.current_seek++);
        break;
      case buffer_u16:
        this.data.writeUInt16LE(val, this.current_seek);
        this.current_seek += 2;
        break;
      case buffer_s16:
        this.data.writeInt16LE(val, this.current_seek);
        this.current_seek += 2;
        break;
      case buffer_u32:
        this.data.writeUInt32LE(val, this.current_seek);
        this.current_seek += 4;
        break;
      case buffer_s32:
        this.data.writeInt32LE(val, this.current_seek);
        this.current_seek += 4;
        break;
      case buffer_u64:
        this.data.writeBigUInt64LE(val, this.current_seek);
        this.current_seek += 8;
        break;
      case buffer_f16:
        this.data.writeFloatLE(val, this.current_seek);
        this.current_seek += 4;
        break;
      case buffer_f32:
        this.data.writeFloatLE(val, this.current_seek);
        this.current_seek += 4;
        break;
      case buffer_f64:
        this.data.writeDoubleLE(val, this.current_seek);
        this.current_seek += 8;
        break;
      case buffer_bool:
        this.data.writeUInt8(val ? 1 : 0, this.current_seek++);
        break;
      case buffer_string:
        this.data.write(val, this.current_seek, 'utf-8');
        this.current_seek += val.length + 1;
        break;
      case buffer_text:
        this.data.write(val, this.current_seek);
        this.current_seek += val.length + 1;
        break;
    }
  }
}

function buffer_create(size, type, alignment) {
  return new __GM_BUFFER(size, type, alignment);
}

function buffer_exists(buffer) {
  return buffer instanceof __GM_BUFFER;
}

function buffer_create_from_vertex_buffer(vertex_buffer, type, alignment) {
  __not_support('buffer_create_from_vertex_buffer');
}

function buffer_create_from_vertex_buffer_ext() {
  __not_support('buffer_create_from_vertex_buffer_ext');
}

function buffer_delete(buffer) {
  // no-op
}

function buffer_read(buffer, type) {
  return buffer.read(type);
}

function buffer_write(buffer, type, val) {
  buffer.write(type, val);
}

function buffer_fill(buffer, offset, type, value, size) {
  buffer.data.fill(value, offset, offset + size);
}

function buffer_seek(buffer, base, offset) {
  switch (base) {
    case buffer_seek_start:
      buffer.current_seek = offset;
      break;
    case buffer_seek_relative:
      buffer.current_seek += offset;
      break;
    case buffer_seek_end:
      buffer.current_seek = buffer.size + offset;
      break;
  }

  buffer.current_seek = Math.max(0, Math.min(buffer.current_seek, buffer.size));
}

function buffer_tell(buffer) {
  return buffer.current_seek;
}

function buffer_peek(buffer, offset, type) {
  const current_seek = buffer.current_seek;
  buffer.current_seek = offset;
  const val = buffer.read(type);
  buffer.current_seek = current_seek;
  return val;
}

function buffer_poke(buffer, offset, type, value) {
  const current_seek = buffer.current_seek;
  buffer.current_seek = offset;
  buffer.write(type, value);
  buffer.current_seek = current_seek;
}

function buffer_save(buffer, filename) {
  fs.writeFileSync(filename, buffer.data);
}

function buffer_save_ext(buffer, filename, offset, size) {
  const data = buffer.data.slice(offset, offset + size);
  fs.writeFileSync(filename, data);
}

function buffer_save_async() {
  __not_support('buffer_save_async');
}

function buffer_load(filename) {
  const buff = fs.readFileSync(filename);
  const gmBuffer = new __GM_BUFFER(buff.length, buffer_grow, 1);
  gmBuffer.data = buff;
  return gmBuffer;
}

function buffer_load_ext(buffer, filename, offset) {
  const buff = fs.readFileSync(filename);
  buffer.data.set(buff, offset);
}

function buffer_load_async() {
  __not_support('buffer_load_async');
}

function buffer_load_partial(buffer, filename, offset, src_len, dest_offset) {
  const buff = fs.readFileSync(filename);
  buffer.data.set(buff.slice(offset, offset + src_len), dest_offset);
}

function buffer_compress(buffer, offset, size) {
  const data = buffer.data.slice(offset, offset + size);
  const compressed = zlib.deflateSync(data);
  return compressed;
}

function buffer_decompress(buffer) {
  const decompressed = zlib.inflateSync(buffer.data);
  return decompressed;
}

function buffer_async_group_begin(groupname) {
  __not_support('buffer_async_group_begin');
}

function buffer_async_group_option(option, value) {
  __not_support('buffer_async_group_option');
}

function buffer_async_group_end() {
  __not_support('buffer_async_group_end');
}

function buffer_copy(src_buffer, src_offset, size, dest_buffer, dest_offset) {
  const data = src_buffer.data.slice(src_offset, src_offset + size);
  dest_buffer.data.set(data, dest_offset);
}

function buffer_copy_from_vertex_buffer() {
  __not_support('buffer_copy_from_vertex_buffer');
}

function buffer_get_type(buffer) {
  return buffer.type;
}

function buffer_get_alignment(buffer) {
  return 1;
}

function buffer_get_address(buffer) {
  return buffer.data;
}

function buffer_get_size(buffer) {
  return buffer.size;
}

function buffer_get_surface(buffer, surface, offset) {
  __not_support('buffer_get_surface');
}

function buffer_set_surface(buffer, surface, offset) {
  __not_support('buffer_set_surface');
}

function buffer_resize(buffer, newsize) {
  buffer.data = Buffer.concat([buffer.data, Buffer.alloc(newsize - buffer.size)]);
  buffer.size = newsize;
}

function buffer_sizeof(type) {
  switch (type) {
    case buffer_u8:
    case buffer_s8:
    case buffer_bool:
    case buffer_text:
    case buffer_string:
      return 1;
    case buffer_u16:
    case buffer_s16:
      return 2;
    case buffer_u32:
    case buffer_s32:
    case buffer_f32:
      return 4;
    case buffer_f64:
      return 8;
  }
}

function buffer_md5(buffer, offset, size) {
  const data = buffer.data.slice(offset, offset + size);
  const hash = crypto.createHash('md5');
  hash.update(data);
  return hash.digest('hex');
}

function buffer_sha1(buffer, offset, size) {
  const data = buffer.data.slice(offset, offset + size);
  const hash = crypto.createHash('sha1');
  hash.update(data);
  return hash.digest('hex');
}

function buffer_crc32(buffer, offset, size) {
  __not_support('buffer_crc32');
}

function buffer_base64_encode(buffer, offset, size) {
  const data = buffer.data.slice(offset, offset + size);
  return data.toString('base64');
}

function buffer_base64_decode(str) {
  const buff = Buffer.from(str, 'base64');
  const gmBuffer = new __GM_BUFFER(buff.length, buffer_grow, 1);
  gmBuffer.data = buff;
  return gmBuffer;
}

function buffer_base64_decode_ext(buffer, str, offset) {
  const buff = Buffer.from(str, 'base64');
  buffer.data.set(buff, offset);
}

function buffer_set_used_size(buffer, size) {
  __not_support('buffer_set_used_size');
}

// #endregion

// #region General Game Control

function game_end() {
  process.exit();
}

function game_restart() {
  __not_support('game_restart');
}

function game_load(filename) {
  __not_support('game_load');
}

function game_load_buffer(buffer) {
  __not_support('game_load_buffer');
}

function game_save(filename) {
  __not_support('game_save');
}

function game_save_buffer(buffer) {
  __not_support('game_save_buffer');
}

function game_get_speed() {
  return 0;
}

function game_set_speed(fps) {
  __not_support('game_set_speed');
}

function highscore_add(name, score) {
  __not_support('highscore_add');
}

function highscore_name() {
  __not_support('highscore_name');
}

function highscore_value() {
  __not_support('highscore_value');
}

function highscore_clear() {
  __not_support('highscore_clear');
}

// #endregion

// #region Web and HTML5

function url_open_ext(url, target) {
  __not_support('url_open_ext');
}

function url_open_full(url, target, options) {
  __not_support('url_open_full');
}

function url_get_domain() {
  __not_support('url_get_domain');
}

// #endregion

// #region OS And Compiler

function os_get_config() {
  __not_support('os_get_config');
}

function os_get_language() {
  return process.env.LANG;
}

function os_get_region() {
  __not_support('os_get_region');
}

function os_get_info() {
  __not_support('os_get_info');
}

function os_powersave_enable() {
  __not_support('os_powersave_enable');
}

function os_lock_orientation(flag) {
  __not_support('os_lock_orientation');
}

function os_check_permission() {
  __not_support('os_check_permission');
}

function os_request_permission() {
  __not_support('os_request_permission');
}

function gml_pragma(command, value) {
  if (command === 'global') {
    eval(value);
  }
}

function parameter_count() {
  return process.argv.length - 2;
}

function parameter_string(index) {
  return process.argv[index + 2];
}

function environment_get_variable(name) {
  return process.env[name];
}

function scheduler_resolution_get() {
  __not_support('scheduler_resolution_get');
}

function scheduler_resolution_set() {
  __not_support('scheduler_resolution_set');
}

// #endregion