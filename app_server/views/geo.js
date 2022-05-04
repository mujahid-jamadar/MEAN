<script>

	// This is from Google Map Javascript libraries: https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-addressform
      // This example displays an address form, using the autocomplete feature
      // of the Google Places API to help users fill in the information.

      // This example requires the Places library. Include the libraries=places
      // parameter when you first load the API. For example:
      // <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

      var placeSearch, autocomplete;



      function initAutocomplete() {
        // Create the autocomplete object, restricting the search to geographical
        // location types.
        autocomplete = new google.maps.places.Autocomplete(
            /** @type {!HTMLInputElement} */(document.getElementById('address')),
            {types: ['geocode']});

        // When the user selects an address from the dropdown, populate the address
        // fields in the form.
        // autocomplete.addListener('place_changed', fillInAddress);
      }


      // Bias the autocomplete object to the user's geographical location,
      // as supplied by the browser's 'navigator.geolocation' object.
      function geolocate() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var geolocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            var circle = new google.maps.Circle({
              center: geolocation,
              radius: position.coords.accuracy
            });
            autocomplete.setBounds(circle.getBounds());
          });
        }
      }

      function geocodeAddress() {

        var geocoder = new google.maps.Geocoder();
        var address = document.getElementById('address').value;
        console.log(address);

        geocoder.geocode({'address': address}, function(results, status) {
          console.log(status)

          if (status === 'OK') {
            console.log(results[0].geometry.location.lat());
            console.log(results[0].geometry.location.lng());
            // document.getElementById('addresslat').setAttribute('value',results[0].geometry.location.lat());
            // document.getElementById('addresslng').value = results[0].geometry.location.lng();

            document.getElementById('addresslat').value = results[0].geometry.location.lat();
            document.getElementById('addresslng').value = results[0].geometry.location.lng();
            console.log(document.profile.addresslat.value);
            if(document.profile.addresslat.value!==''){
              document.profile.submit();
              console.log('here');
              return true;
            }
            else{
              return false;
            }
          } else {
            alert('Please ensure your address valid!');
            return false;
          }
        });
        alert('Are you sure to submit?')
        return false;

      }
    function geocodeLatLng(address,id) {
      console.log(address);
      console.log(id);
      var geocoder = new google.maps.Geocoder();
      var latlng = {lat: parseFloat(address[1]), lng: parseFloat(address[0])};
      geocoder.geocode({'location': latlng}, function(results, status) {
        if (status === 'OK') {
          if (results[1]) {
            console.log(results[1].formatted_address);
            document.getElementById(id).innerHTML = results[1].formatted_address;
            document.getElementsByName(id)[0].style.display = 'none';
          } else {
            window.alert('No results found');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
      });
  }

    </script>
