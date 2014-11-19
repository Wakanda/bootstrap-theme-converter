'use strict';

/**
 * @ngdoc function
 * @name themeBuilderApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the themeBuilderApp
 */
angular.module('themeBuilderApp')
	.controller('MainCtrl', function ($scope, $timeout, bootstrapSettings) {


		$scope.themeDetails = {
			'name': 'My Theme',
			'author': 'Grumpy Cat',
			'repository':{
				'type':'git',
				'url':'Repo Url'
			},
			'copyright':'GNU GPL v3, AGPL v3, Commercial',
			'license':'MIT',
			'engines':{
				'wakanda':'>=11'
			},
			'studio':{
				'label':'Wakanda Corporate',
				'mobile':'false'
			},
			'version':'1.0.0',
			'loadDependencies':[
				{
					'id': '',
					'path':'THEMES_CUSTOM'
				}
			],
			'hash':'91038c8630d0ca29ba43354e7b3a79322720d3d7'
		};


		$scope.$watch('themeDetails', function(newVal){
			
			$scope.secureName = newVal.name.toLowerCase().replace(/ /g, '_');

			$scope.themeDetails.loadDependencies[0].id = $scope.secureName +'/'+ $scope.secureName +'.css' ;
		});
		


		// ------------------------------------------------------------------------------
		// > Load basics less vars from config.json (in styles/bootstrap folder)
		// ------------------------------------------------------------------------------
		$scope.loadBasicVars = function(){
			bootstrapSettings.get().$promise.then(function(data){

				$scope.lessVars = data.vars;
				$scope.refresh();
			});
		};

		$scope.loadBasicVars();
		

		// ------------------------------------------------------------------------------
		// > Refresh and apply less vars (with a timeout for direct input typing)
		// ------------------------------------------------------------------------------
		$scope.refresh = function(){
			$timeout(function() {
				less.modifyVars( $scope.lessVars );
			}, 1000);
		};


		// ------------------------------------------------------------------------------
		// > DRAG & DROP CONFIG FILE
		// ------------------------------------------------------------------------------
		
		// Setup the dnd listeners.
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
						
						lessVars = angular.fromJson( evt.target.result );

						$scope.lessVars = lessVars.vars;
						$scope.$apply();
						console.log(lessVars.vars);
					}

					// if file is 'variables.less'
					else if(file.name.split('.').pop() === 'less'){
						
						// get each line in an array
						var content = evt.target.result.toString().split('\n');

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

						$scope.lessVars = lessVars;
						$scope.$apply();
						console.log( lessVars );

					}

					// Modify vars and apply changes
					$scope.refresh();

					console.log($scope.lessVars);
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
			
			var lessToCssID = window.location.pathname.substring(1).replace('/', '-'); // absolute file path

			$scope.resultedCss = document.getElementById('less:'+ lessToCssID +'styles-bootstrap-bootstrap').innerHTML;
			console.log($scope.resultedCss);

			if(studio != undefined){

				studio.extension.storage.setItem('themeName', $scope.secureName);
				studio.extension.storage.setItem('themeJson', angular.toJson( $scope.themeDetails ));
				studio.extension.storage.setItem('themeCss', $scope.resultedCss);
				studio.sendCommand('ThemeBuilder.exportTheme');

			} else{

				var zip = new JSZip();
				var folder = zip.folder($scope.secureName);

				folder.file( 'package.json', angular.toJson( $scope.themeDetails ) ); // package.json
				folder.file( $scope.secureName +'.css', $scope.resultedCss ); // package.json

				var content = zip.generate({type: 'blob'});

				// FileSaver.js
				saveAs( content, $scope.secureName+'.zip' );
			}
			

		};


	});













