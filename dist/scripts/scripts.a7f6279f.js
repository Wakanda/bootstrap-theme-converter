"use strict";angular.module("themeBuilderApp",["ngResource","ngRoute","ngSanitize"]),angular.module("themeBuilderApp").controller("MainCtrl",["$scope","$timeout","bootstrapSettings","$window",function(a,b,c,d){function e(a){var b={};return b=angular.fromJson(a),b.vars}function f(a){var b={},c=a.toString().split("\n");return angular.forEach(c,function(a){if("@"===a[0]){var c=a.split(":")[0],d=a.split(":")[1];d=d.replace(/^\s+/,""),d=d.split(";")[0],b[c]=d}}),b}function g(a){a.stopPropagation(),a.preventDefault(),a.dataTransfer.dropEffect="copy"}function h(b){b.stopPropagation(),b.preventDefault();var c=b.dataTransfer.files[0];if(c){var d=new FileReader;d.readAsText(c,"UTF-8"),d.onload=function(b){"json"===c.name.split(".").pop()?(a.lessVars=e(b.target.result),a.$apply()):"less"===c.name.split(".").pop()&&(a.lessVars=f(b.target.result),a.$apply()),a.refresh()},d.onerror=function(){a.lessVars="error reading file"}}}a.tabNav="details",a.themeDetails={name:"wakanda_starter_theme",author:"Grumpy Cat",repository:{type:"git",url:"Repo Url"},copyright:"GNU GPL v3, AGPL v3, Commercial",license:"MIT",engines:{wakanda:">=11"},studio:{label:"Wakanda Starter Theme",mobile:"false"},version:"1.0.0",loadDependencies:[{file:""}]},a.studio=angular.isDefined(d.studio)?!0:!1,a.updateInfos=function(){a.secureName=a.themeDetails.studio.label.toLowerCase().replace(/ /g,"_"),a.themeDetails.name=a.secureName,a.themeDetails.loadDependencies[0].file=a.secureName+".css"},a.updateInfos(),a.loadBasicVars=function(){c.get().$promise.then(function(b){a.lessVars=b.vars,a.lessVars["@theme"]=a.secureName,a.refresh(),a.$watch("themeDetails.name",function(){a.lessVars["@theme"]=a.secureName,a.refresh()})})},a.loadBasicVars(),a.refresh=function(){b(function(){less.modifyVars(a.lessVars)},1e3)},a.selectFile=function(b){studio.extension.storage.setItem("fileType",b),studio.sendCommand("ThemeBuilder.selectFile"),"error"!==studio.extension.storage.getItem("selectedFile")&&("json"===b&&(a.lessVars=e(studio.extension.storage.getItem("selectedFile"))),"less"===b&&(a.lessVars=f(studio.extension.storage.getItem("selectedFile")))),a.refresh()};var i=document.getElementById("drop_zone");i.addEventListener("dragover",g,!1),i.addEventListener("drop",h,!1),a.generateTheme=function(){var b="";if(angular.isUndefined(d.studio)?b=window.location.pathname.substring(1).replace("/","-"):angular.isDefined(d.studio)&&(studio.extension.getFolder().path.split("/").forEach(function(a,c){""!==a&&1!==c&&(b+=a+"-")}),b+="dist-"),b="less:"+b+"styles-wakanda_starter_theme-wakanda_starter_theme",a.resultedCss=document.getElementById(b).innerHTML,console.log(a.resultedCss),angular.isUndefined(d.studio)){var c=new JSZip,e=c.folder(a.secureName);e.file("package.json",angular.toJson(a.themeDetails)),e.file(a.secureName+".css",a.resultedCss);var f=c.generate({type:"blob"});saveAs(f,a.secureName+".zip")}else angular.isDefined(d.studio)&&(studio.extension.storage.setItem("themeName",a.secureName.toString()),studio.extension.storage.setItem("themeJson",angular.toJson(a.themeDetails).toString()),studio.extension.storage.setItem("themeCss",a.resultedCss.toString()),studio.sendCommand("ThemeBuilder.exportTheme"))}}]),angular.module("themeBuilderApp").service("bootstrapSettings",["$resource",function(a){return a("styles/wakanda_starter_theme/config.json")}]);