'use strict';

/**
 * @ngdoc function
 * @name themeBuilderApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the themeBuilderApp
 */
angular.module('themeBuilderApp')
	.controller('MainCtrl', function ($scope, $timeout, bootstrapSettings, $window) {

		// this should equal folder
		$scope.extensionName = 'bootstrap-theme-converter';

		$scope.tabNav = 'details';

		// Studio or browser ?
		if( angular.isDefined( $window.studio ) ){
			$scope.studio = true;
			$scope.studioVersion = $window.studio.mainProductVersion;
		} else{
			$scope.studio = false;
			$scope.studioVersion = 11;
		}

		var engineVersion = '';
		if($scope.studioVersion < 11){
			engineVersion = '<=10';
		}else{
			engineVersion = '>=11';
		}

		var themeDependencies = [];

		if($scope.studioVersion < 11){
			themeDependencies = [{
		        "id": "",
		        "path": "THEMES_CUSTOM"
			}];
		}else{
			themeDependencies = [{
				"file": ""
			}];
		}

		$scope.themeDetails = {
			name: 'wakanda_starter_theme',
			author: 'Wakanda Developer',
			repository:{
				type:'git',
				url:'Repo Url'
			},
			copyright:'GNU GPL v3, AGPL v3, Commercial',
			license:'MIT',
			engines:{
				wakanda:engineVersion
			},
			studio:{
				label:'Wakanda Starter Theme',
				mobile:'false'
			},
			version:'1.0.0',
			loadDependencies:themeDependencies
		};

		$scope.updateInfos = function(){
			$scope.secureName = $scope.themeDetails.studio.label.toLowerCase().replace(/ /g, '_');
			$scope.themeDetails.name = $scope.secureName;


			if($scope.studioVersion < 11){
				$scope.themeDetails.loadDependencies[0].id = $scope.secureName +'.css';
			}else{
				$scope.themeDetails.loadDependencies[0].file = $scope.secureName +'.css';
			}

		};
		$scope.updateInfos();
		


		// ------------------------------------------------------------------------------
		// > Load basics less vars from config.json (in styles/bootstrap folder)
		// ------------------------------------------------------------------------------
		$scope.loadBasicVars = function(){
			bootstrapSettings.get().$promise.then(function(data){

				$scope.lessVars = data.vars;
				$scope.lessVars['@theme'] = $scope.secureName;
				$scope.refresh();

				//console.log(data.vars);

				// Change theme variable if changed in main page
				$scope.$watch('themeDetails.name', function() {
					$scope.lessVars['@theme'] = $scope.secureName;
					$scope.refresh();
				});
			});
		};

		$scope.loadBasicVars();

		// ------------------------------------------------------------------------------
		// > Refresh and apply less vars (with a timeout for direct input typing)
		// ------------------------------------------------------------------------------
		$scope.refresh = function(){
			$timeout(function() {
				less.modifyVars( $scope.lessVars );
				//console.log($scope.lessVars);
			}, 1000);
		};

		// ------------------------------------------------------------------------------
		// > Cutting JSON & LESS
		// ------------------------------------------------------------------------------
		function getVarsFromJson(file){

			var lessVars = {};
			lessVars = angular.fromJson( file );

			return lessVars.vars;
		}

		function getVarsFromLess(file){
			
			var lessVars = {};
				
			// get each line in an array
			var content = file.toString().split('\n');

			// for each line
			angular.forEach(content, function(newVal){

				// if begin with an @ create json tree
				if(newVal[0] === '@'){

					// var name
					var lessVar = newVal.split(':')[0];

					var lessVarValue = newVal.split(':')[1]; // get the var
					lessVarValue = lessVarValue.replace(/^\s+/, ''); // delete unwanted spaces before var value
					lessVarValue = lessVarValue.split(';')[0]; // detele unwanted characters after the var value

					lessVars[lessVar] = lessVarValue; // add var/value to parent object
				}
			});

			return lessVars;
		}



		// ------------------------------------------------------------------------------
		// > SELECT A FILE (studio only)
		// ------------------------------------------------------------------------------
		$scope.selectFile = function(type){

			studio.extension.storage.setItem('fileType', type);
			studio.sendCommand($scope.extensionName+'.selectFile');

			//console.log( studio.extension.storage.getItem('selectedFile') );

			if(studio.extension.storage.getItem('selectedFile') !== 'error'){

				if(type === 'json'){
					$scope.lessVars = getVarsFromJson( studio.extension.storage.getItem('selectedFile') );
				}
				if(type === 'less'){
					$scope.lessVars = getVarsFromLess( studio.extension.storage.getItem('selectedFile') );
				}
			}
			
			//console.log( $scope.lessVars );
			$scope.refresh();
		};

		// ------------------------------------------------------------------------------
		// > DRAG & DROP CONFIG FILE (browser only)
		// ------------------------------------------------------------------------------
		
		// Setup the dnd listeners.
		// var dropZone = document.getElementById('drop_zone');
		var dropZone = document.getElementById('drop_zone');
	
		// On drag over	
		function handleDragOver(evt) {
			evt.stopPropagation();
			evt.preventDefault();
			evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
		}

		// On file drop
		function handleFileSelect(evt) {
			evt.stopPropagation();
			evt.preventDefault();

			var file = evt.dataTransfer.files[0]; // FileList object.

			if (file) {
				var reader = new FileReader();
				reader.readAsText(file, 'UTF-8');
				reader.onload = function (evt) {
					
					var lessVars = {};
					
					// if file is 'config.json'
					if( file.name.split('.').pop() === 'json'){
						
						// lessVars = angular.fromJson( evt.target.result );

						$scope.lessVars = getVarsFromJson( evt.target.result );
						$scope.$apply();
						//console.log(lessVars.vars);
					}

					// if file is 'variables.less'
					else if(file.name.split('.').pop() === 'less'){

						$scope.lessVars = getVarsFromLess(evt.target.result);
						$scope.$apply();
						//console.log( lessVars );
					}

					// Modify vars and apply changes
					$scope.refresh();

					//console.log($scope.lessVars);
				};
				reader.onerror = function () {
					$scope.lessVars = 'error reading file';
				};
			}
		}

		dropZone.addEventListener('dragover', handleDragOver, false);
		dropZone.addEventListener('drop', handleFileSelect, false);


		// ------------------------------------------------------------------------------
		// > GENERATE CUSTOM THEME
		// ------------------------------------------------------------------------------
		$scope.generateTheme = function(){
			
			var lessToCssID = '';

			// if in browser
			// ------------------------------------------------------------------------------
			if( angular.isUndefined( $window.studio ) ){
				lessToCssID = window.location.pathname.substring(1).replace('/', '-'); // absolute file path
			}
			// ------------------------------------------------------------------------------


			//if in studio
			// ------------------------------------------------------------------------------
			else if( angular.isDefined( $window.studio ) ){

				studio.extension.getFolder().path.split('/').forEach(function(value, key){
					if(value !== '' && key !== 1){
						lessToCssID += value +'-';
					}
				});
				lessToCssID += 'dist-';
			}
			// ------------------------------------------------------------------------------


			//console.log(lessToCssID);
			lessToCssID = 'less:'+ lessToCssID +'styles-wakanda_starter_theme-wakanda_starter_theme';
			//console.log(lessToCssID);

			$scope.resultedCss = document.getElementById(lessToCssID).innerHTML;
			//console.log($scope.resultedCss);


			// if in browser
			// ------------------------------------------------------------------------------
			if( angular.isUndefined( $window.studio ) ){

				var zip = new JSZip();
				var folder = zip.folder($scope.secureName);

				folder.file( 'package.json', angular.toJson( $scope.themeDetails ) ); // package.json
				folder.file( $scope.secureName +'.css', $scope.resultedCss ); // package.json

				var content = zip.generate({type: 'blob'});

				// FileSaver.js
				saveAs( content, $scope.secureName+'.zip' );
			}

			// if in studio
			// ------------------------------------------------------------------------------
			else if( angular.isDefined( $window.studio ) ){

				studio.extension.storage.setItem('themeName', $scope.secureName.toString() );
				studio.extension.storage.setItem('themeJson', angular.toJson($scope.themeDetails).toString() );
				studio.extension.storage.setItem('themeCss', $scope.resultedCss.toString() );

				studio.sendCommand($scope.extensionName+'.exportTheme');
			}
			

		};


	});