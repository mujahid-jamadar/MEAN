<script>
var app = angular.module("matchApp", []);
app.controller("matchCtrl", function($scope,$http) {
    $scope.normal=true;
    $scope.search = false;
    $scope.updateForm = function () {
        var sex = document.getElementById('sex').value;
        var sport = document.getElementById('sport').value;
        var skill = document.getElementById('skill').value;
        var age = document.getElementById('age').value;
        var address = document.getElementById('address').value;

        console.log(document.getElementById("sport").value);
        $http({
            method : "POST",
            url : "/api/match",
            data: {
              'sex' : sex,
              'sport':sport,
              'skill':skill,
              'age':age,
              'address':address
                }
          }).then(function mySuccess(response) {
              console.log(response.data.error);
              if(response.data.error){
                if(response.data.error=='login'){
                  window.location = "/login";
                }else{
                  window.alert("Some Problems with your "+response.data.error);
                }
              }
              else{
                console.log(response.data.partners[0]);
                var partners = response.data.partners;
                var users = response.data.user;
                console.log(partners);
                $scope.normal = false;
                $scope.Math = window.Math;

                $scope.teammates = partners;
                $scope.user = users;
                $scope.search = true;
              }
            }, function myError(response) {
              window.alert("Some Problems with your match conditions");
          });
        };
    $scope.getaddress = function(index){
      var lat = document.getElementById('lat'+index).value;
      var lng = document.getElementById('lng'+index).value;
      var address = [lng,lat];
      function geocodeLatLng(address,index) {
        console.log(address);

        var geocoder = new google.maps.Geocoder();
        var latlng = {lat: parseFloat(address[1]), lng: parseFloat(address[0])};
        geocoder.geocode({'location': latlng}, function(results, status) {
          if (status === 'OK') {
            if (results[1]) {
              console.log(results[1].formatted_address);
              document.getElementById('show'+index).innerHTML = results[1].formatted_address;
              document.getElementById('button'+index).style.display = 'none';
            } else {
              window.alert('No results found');
            }
          } else {
            window.alert('Geocoder failed due to: ' + status);
          }
        });
    }
    geocodeLatLng(address,index);

    }
      });
</script>
