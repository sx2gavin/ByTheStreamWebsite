/************************************************************************ 
 * Feb 2018
 * All constant values are defined here.
 * Please modify this file if you would like to change any of the values.
 ************************************************************************/

/* folder names and file names */
var CONTENT_FOLDER = "content/";
var CONTENT_HTML_FILE_NAME = "volume.html";
var VOLUME_FOLDER_PREFIX = "volume_";
var TABLE_OF_CONTENT_FILE_NAME = "table_of_content.json";
var VOLUME_LIST_FILE_NAME = "volume_list.json";

/* DOM object id*/
var DOM_CONTENT_ID = "content";
var DOM_TABLE_OF_CONTENT_ID = "table-of-content";
var DOM_TABLE_OF_CONTENT_CONTAINER_ID = "table-of-content-container";
var DOM_VOLUMES_ID = "volumes";
var DOM_NAV_TABLE_OF_CONTENT = "navbar-toc";
var DOM_CHARACTER_SWITCH_BUTTON = "simplify-traditional-switch-button";

/* other constant values */
var LATEST_VOLUME_NUMBER = 53;

/* REST API urls */
// when using the following constants, append the volume number after like this: REST_WHOLE_VOLUME + "1".
var REST_WHOLE_VOLUME = '/article/get';
var REST_TABLE_OF_CONTENT = '/article/list';
var REST_VOLUME_LIST = '/volumes/list';
var REST_VERSION_AVAILABLE = '/version-available';
