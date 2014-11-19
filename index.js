/* Copyright (c) 4D, 2014
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
*
* The Software shall be used for Good, not Evil.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*/

var	actions;
actions = {};


// LAUNCH THEME BUILDER
actions.initBuilder = function initBuilder() {
	'use strict';

	studio.extension.registerTabPage('./dist/index.html', './img/rsz_logo-addon.png');
	studio.extension.openPageInTab('./dist/index.html', 'Theme Builder', false);
	
	return true;
};

// EXPORT THEME
actions.exportTheme = function exportTheme() {
	"use strict";
	
	var themeName = studio.extension.storage.getItem('themeName');
	var themeJson = studio.extension.storage.getItem('themeJson');
	var themeCss = studio.extension.storage.getItem('themeCss');


	// get export path (global theme folder or project theme folder)
	var dest = getThemesRootFolder();

	// Wanted theme folder name
	var destThemeFolder = Folder( dest.path + themeName );

	// check if folder already here
	if( !destThemeFolder.exists ){

		// create theme main folder
		var myFolder = new Folder( dest.path + themeName ).create(); 
		
		// create json file
		new File(dest.path +'my_theme/package.json').create(); 

		// fill json
		var mystream = new TextStream(dest.path +'my_theme/package.json', 'write');
		mystream.write( themeJson );
		mystream.close();

		// create css
		new File(dest.path +'my_theme/my_theme.css').create(); // create css file

		// fill css
		var mystream = new TextStream(dest.path +'my_theme/my_theme.css', 'write');
		mystream.write( themeCss );
		mystream.close();
	}
	// the folder already exist :'(
	else{
		studio.alert('You already have a directory with the same name :\'(');
	}


	return true;
};

function getThemesRootFolder() {

	if (studio.extension.storage.getItem('projectpath') && studio.extension.storage.getItem('projectpath') != 'Favorites') {
		return rootAddonsFolder = Folder(studio.extension.storage.getItem('projectpath') + 'Themes/');
	} else {
		return rootAddonsFolder = FileSystemSync('THEMES_CUSTOM');
	}
}




exports.handleMessage = function handleMessage(message) {
	"use strict";
	var
		actionName;

	actionName = message.action;

	if (!actions.hasOwnProperty(actionName)) {
		studio.alert("I don't know about this message: " + actionName);
		return false;
	}
	actions[actionName](message);
};