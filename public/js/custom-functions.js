
function custom_console(msg) {
	
	var temp = msg.split('|');
	
	var message = $('<div>').text(temp[0]);
	
	if(temp[1]) { message.css('color', temp[1]); }
	
	if($('#custom-console').length) {
		
		$('#custom-console').append(message);
		
	} else {
		
		$('body').append($('<div>').attr('id','custom-console').css({
			'position': 'absolute',
			'top': '50px',
			'right': '25px',
			'height': '200px',
			'width': '200px',
			'overflow':'auto',
			'z-index': '99',
			'background': 'black',
			'color': '#fff'
		}).append(message));
	
	}
	
}

function show_preloader() {

	$('body').append($('<div>').attr('id', 'preloader'));

	//disable clicking on the main table
	if($('.table').length > 0) {
		$('.table').append($('<div>').attr('id', 'preloader-disabler'));
	}

}

function hide_preloader() {
	$('#preloader').remove();
	$('#preloader-disabler').remove();
}

function show_local_preloader(pointer) {

	pointer.append($('<div>').addClass('local-preloader'));

}

function hide_local_preloader(pointer) {

	pointer.find('.local-preloader').remove();

}

function image_loader(pointer, img_param) {

	//add the loader icon
	pointer.css('position', 'relative').append($('<div>').attr('id', 'preloader-image'));

	var img = img_param;

	img.load(function() {

		$('#preloader-image').remove();

		pointer.append(img);

	});

}

//gets a number and a currency symbol and returns a formatted float number
function get_currency(num, front, symbol) {

	var front_symbol = front ? symbol : '';

	var end_symbol = !front ? symbol : '';

	return front_symbol + parseFloat(num).toFixed(2) + ' ' + end_symbol;

}

function undo_btn(e) {
	
	e.preventDefault();
	
	$('.custom-form input').each(function() {
	
		var type = $(this).attr('type');
		
		if((type == 'text' || type == 'password') && !$(this).prop('disabled')) {

			$(this).val('');
		
		} else if(type == 'text' && $(this).attr('id') == 'status') {

			$(this).removeClass('input-red').removeClass('input-green').addClass('input-neutral').val('');

		} else if(type == 'checkbox') {
			
			$(this).prop('checked', false);
			
		}
	
	});

	//reset all the select dropdowns to the first value
	$('.custom-form select').each(function() {

		$(this).val($(this).find('option:first').val());

	});

	
}

function capitalizeFirstLetter(string) {

	return string.charAt(0).toUpperCase() + string.slice(1);

}

function show_center_window(url, title, w, h) {
    // Fixes dual-screen position                         Most browsers      Firefox
    var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
    var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

    var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    var left = ((width / 2) - (w / 2)) + dualScreenLeft;
    var top = ((height / 2) - (h / 2)) + dualScreenTop;
    var newWindow = window.open(url, title, 'scrollbars=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

    // Puts focus on the newWindow
    if (window.focus) {
        newWindow.focus();
    }
	
	//refreshes the parent window when it gets closed
	newWindow.onload = function() {
		
		var user_obj = $(newWindow.document.documentElement).find('pre').html();
		
		if(user_obj) {
			
			newWindow.close();
			
			newWindow.opener.parent_facebook_callback(user_obj);
				
		}
		
		
		
    }
	
}

$.ajaxSetup({
	headers: {
		'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
	}	
});

//everything will produce false result (including nulls and empty strings) except a positive number
function is_whole_positive_num(a) {

	if (a && !isNaN(a)) {
		
		return (a % 1 === 0) && (a >= 0);
	  
	} else {
		
		return false;
	  
	}

}

function is_email(email) {
	var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return regex.test(email);
}

//takes a date in the following format yyyy-mm-dd and returns its date object exquivalent
function custom_date_obj(a) {

	if(a.trim()) {

		var date = new Date();

		//removes any unnecessary extra data in case the format is yyyy-mm-dd H:i:s
		a = a.split(' ')[0];

		var d = parseInt(a.split('-')[2].split(' ')[0]);
		var m = parseInt(a.split('-')[1]);
		var y = parseInt(a.split('-')[0]);

		date.setDate(d);
		date.setMonth(m-1);
		date.setYear(y);

		return date;

	} else {

		return null;

	}

}

function custom_html_entity_decode(str) {

	var elem = document.createElement('textarea');
	elem.innerHTML = str;
	return elem.value
	
}

//gets a string that has an object structure and makes it into an array
function convt_str_to_obj(str) {

	var arr = JSON.parse(str.replace(/"/g, '').replace(/&quot;/g, '"'));

	//remove any possible null values in the array
	for(var i=0; i<arr.length; i++) {

		if(!arr[i]) {
			arr.splice(i,1);
		}

	}

	return arr;
	
}

//gets a string that has an object filled with objects structure and makes it into an array of objects
function convt_str_to_obj_arr(str) {
	
	var new_str = JSON.parse(str.replace(/&quot;/g, '"'));
	
	var arr = [];
	
	for(var key in new_str) {
		
		arr.push( new_str[key]);
		
	}
	
	return arr;
	
}

//gets a string that has an array structure and makes it into an array
function convet_str_to_arr(str) {
	
	return str.split(',');
	
}

//gets a string that has an array structure with keys and makes it into an array with keys
function convet_str_to_keyarr(str) {
	
	//the elements in the string should be separated by commas; cleans the string of any entities
	var arr_str = custom_html_entity_decode(str).split('|');
	
	//every value should be followed by its assoc key (the array should have an even number of elements)
	
	var result = [];
	
	for(var i=0; i+1<arr_str.length; i+=2) {
		
		result[arr_str[i+1]] = arr_str[i];
		
	}
	
	return result;
	
}

//gets a date in the following format example: 2016-08-12 00:12:43 and converts it to example: Aug 12, 2016
//if the date looks like this 0000-00-00 00:00:00 it will return an empty string
function convert_date1(str, months) {

	if(str && months) {
		
		var date = str.split(' ')[0].split('-');
		
		var y = date[0];
		
		var m = parseInt(date[1]) - 1;

		var d = date[2];
		
		if(parseInt(y) > 0) {
			
			return capitalizeFirstLetter(months[m]) + ' ' + d + ', ' + y;
		
		}
		
		return '';
		
	} else {
		
		return str;
		
	}
	
	
}

//gets a date in the following format example: Aug 12, 2016 and converts it to example: 2016-08-12
function convert_date2(str, months) {
	
	if(str.trim() && months) {
		
		var date = str.split(' ');
		
		var y = date[2];

		var m = ('0' + (months.indexOf(date[0].toLowerCase().trim()) + 1)).slice(-2);
		
		var d = ('0' + date[1].replace(',','')).slice(-2);
			
		return y + '-' + m + '-' + d;
		
	} else {
		
		return str;
		
	}
	
	
}

//function used for exporting

function export_items_func(items, titles, columns, appends, file_name) {
	
	var csvContent = '';

	//add the titles of the columns and before that check that all the titles are provided
	if(titles.length == columns.length) {
		
		//convert the array to a string and mark the end
		csvContent += custom_html_entity_decode(titles.join(';')) + '\n';
		
	}
		
	items.forEach(function(item, index){

		var infoArray = [];

		//try to find every column and append its value; if not found append nothing
		for(var i=0; i<columns.length; i++) {
			
			//check if it is not an object property
			var col_name = columns[i].split('|');

			if(item.hasOwnProperty(col_name[0])) {
				
				var content = '';
				
				if(col_name[1] && item.hasOwnProperty(col_name[1])) {
				
					content = item[col_name[0]][col_name[1]];
				
				} else {
					
					if(appends[i] == 'date') {
						
						content = item[col_name[0]] && item[col_name[0]].indexOf('0000') >= 0 ? '' : item[col_name[0]] ? item[col_name[0]].split(' ')[0] : item[col_name[0]];
					
					} else {
						
						var temp_content;
						
						//if it is an array (or assoc array) use the first value of it
						if(typeof item[col_name[0]] === 'object') {
							
							for(var key in item[col_name[0]]) {
							
								if(item[col_name[0]][key]) { temp_content = item[col_name[0]][key]; }
								break;
								
							}
							
						} else {
							
							temp_content = item[col_name[0]];
							
						}
						
						content = temp_content;
						
					}
					
				}
				
				//append text if any
				if(appends[i] && appends[i] != 'date') { content += appends[i]; }
				
				infoArray.push(content);
				
			}
		
		}
	   
		//convert the array to a string and mark the end
		csvContent += infoArray.join(';') + '\n';

	});

	//var encodedUri = encodeURI(csvContent);
	var fileName = file_name + '.csv';
	
	$('.export_btn').unbind();
	
	var link = $('.export_btn');
	//link.attr('href', encodedUri);
	
	if(window.navigator.msSaveOrOpenBlob) {
		var fileData = [csvContent];
		blobObject = new Blob(fileData);
		link.click(function(){
			window.navigator.msSaveOrOpenBlob(blobObject, fileName);
		});
	} else {
		var url = 'data:text/csv;sep=;charset=utf-8,%EF%BB%BF' + encodeURI(csvContent);
		link.attr('href', url);
		link.attr('download', fileName);
	}
	
}

//functions used for sorting
//it creates a small arrow icon next to the link if the structure requirements are met
//on clicking that link it sorts the table in descending and ascending order
//NOTE! relies that redraw_table function is defined which is specific for every page

var sort_flag = false;
var compare_prop = '';

function sorting_func(link_id, ptr) {
	
	//it is important that it finds the id under the current link
	var curr_sort_ptr = ptr.find(link_id);
	
	if(curr_sort_ptr.length) {
		
		//get the property on which it is going to compare
		compare_prop = $(link_id).closest('a').attr('href');
			
		if(sort_flag) {
			
			sort_flag = false;
			
			curr_sort_ptr.removeClass('fa-sort-asc').addClass('fa-sort-desc');
			
			all_items.sort( compare_asc );
			
			redraw_table();
			
		} else {
		
			sort_flag = true;
			
			curr_sort_ptr.removeClass('fa-sort-desc').addClass('fa-sort-asc');	
			
			all_items.sort( compare_desc );
			
			redraw_table();
			
		}
		
	} else {
		
		$(link_id).remove();
		
		sort_flag = true;
		
		ptr.append($('<i>').addClass('fa fa-sort-asc fa-fw').attr('id', 'curr-sort'));
		
		//get the property on which it is going to compare
		compare_prop = $(link_id).closest('a').attr('href');
		
		all_items.sort( compare_desc );
			
		redraw_table();
		
	}
	
}

function compare_asc(a,b) {
	
	var temp = compare_prop.split('|');
	var prop = temp[0];
	var prop_type = temp[1];
	var prop2 = temp[2];
	
	if(prop2) {
		
		if(a.hasOwnProperty(prop) && a[prop].hasOwnProperty(prop2) && b.hasOwnProperty(prop) && b[prop].hasOwnProperty(prop2)) {
			
			//if set as integer compare it as integers
			if(prop_type == 'integer') {
				
				if (parseInt(a[prop][prop2]) > parseInt(b[prop][prop2])) {
					return -1;
				}
				
				if (parseInt(a[prop][prop2]) < parseInt(b[prop][prop2])) {
					return 1;
				}
				
			} else {
			
				if (a[prop][prop2] > b[prop][prop2]) {
					return -1;
				}
				
				if (a[prop][prop2] < b[prop][prop2]) {
					return 1;
				}
			
			}
			
		} else {
			
			return 0;
			
		}
		
	} else {
		
		if(a.hasOwnProperty(prop) && b.hasOwnProperty(prop)) {
			
			if(prop_type == 'integer') {
				
				if (parseInt(a[prop]) > parseInt(b[prop])) {
					return -1;
				}
				
				if (parseInt(a[prop]) < parseInt(b[prop])) {
					return 1;
				}				
				
			} else {
			
				if (a[prop] > b[prop]) {
					return -1;
				}
				
				if (a[prop] < b[prop]) {
					return 1;
				}
				
			}
			
		} else {
			
			return 0;
			
		}
		
	}
	
}

function compare_desc(a,b) {
	
	var temp = compare_prop.split('|');
	var prop = temp[0];
	var prop_type = temp[1];
	var prop2 = temp[2];
	
	if(prop2) {
		
		if(a.hasOwnProperty(prop) && a[prop].hasOwnProperty(prop2) && b.hasOwnProperty(prop) && b[prop].hasOwnProperty(prop2)) {
			
			//if set as integer compare it as integers
			if(prop_type == 'integer') {
				
				if (parseInt(a[prop][prop2]) < parseInt(b[prop][prop2])) {
					return -1;
				}
				
				if (parseInt(a[prop][prop2]) > parseInt(b[prop][prop2])) {
					return 1;
				}
				
			} else {
			
				if (a[prop][prop2] < b[prop][prop2]) {
					return -1;
				}
				
				if (a[prop][prop2] > b[prop][prop2]) {
					return 1;
				}
			
			}
			
		} else {
			
			return 0;
			
		}
		
	} else {
		
		if(a.hasOwnProperty(prop) && b.hasOwnProperty(prop)) {
			
			if(prop_type == 'integer') {
				
				if (parseInt(a[prop]) < parseInt(b[prop])) {
					return -1;
				}
				
				if (parseInt(a[prop]) > parseInt(b[prop])) {
					return 1;
				}				
				
			} else {
			
				if (a[prop] < b[prop]) {
					return -1;
				}
				
				if (a[prop] > b[prop]) {
					return 1;
				}
				
			}
			
		} else {
			
			return 0;
			
		}
		
	}
	
}

//custom filtering function that filters a table based on a table id, a number of a column and its value

function filter_table(tbl_id, filter_col, filter_name) {

	var ptr = $(tbl_id + ' tbody');

	ptr.find('tr').each(function() {

		if(filter_name.trim() <=0 || $(this).find('td:eq('+ filter_col +')').text().trim() == filter_name.trim()) {

			$(this).show();

		} else {

			$(this).hide();

		}

	});

}

//used for custom messages on input fields

(function (exports) {

	function valOrFunction(val, ctx, args) {
		if (typeof val == "function") {
			return val.apply(ctx, args);
		} else {
			return val;
		}
	}

	function InvalidInputHelper(input, options) {

		input.setCustomValidity(valOrFunction(options.defaultText, window, [input]));

		function changeOrInput() {
			if (input.value == "") {
				input.setCustomValidity(valOrFunction(options.emptyText, window, [input]));
			} else {
				input.setCustomValidity("");
			}
		}

		function invalid() {
			if (input.value == "") {
				input.setCustomValidity(valOrFunction(options.emptyText, window, [input]));
			} else {
				input.setCustomValidity(valOrFunction(options.invalidText, window, [input]));
			}
		}

		input.addEventListener("change", changeOrInput);
		input.addEventListener("input", changeOrInput);
		input.addEventListener("invalid", invalid);
	}

	exports.InvalidInputHelper = InvalidInputHelper;

})(window);