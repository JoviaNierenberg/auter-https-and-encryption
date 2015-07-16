'use strict';

app.controller('LoginCtrl', function ($scope, Auth, $state) {
	$scope.loginUser = function (userData) {
		console.log("in loginUser")
		console.log(userData)
		Auth.login(userData)
		.then(function () {
			$state.go('stories');
		})
		.catch(function (e) {
			console.log('error logging in', e);
		});
	};
});