<script>
  // initialize the map and home

  function initialize() {
    var home = { lat: host.Adress[1], lng: dist[0].Adress[0] };
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: home
    });
    // show the home info
    infoMap(map,home,host,'You');
    var k = 1;
    for (var i =0; i < dist.length;i++){
      if((dist[i].sex)&&(dist[i].sportsdiff)&&(dist[i].email!=host.email)){
        console.log('here');
      infoMap(map,{lat:dist[i].Adress[1],lng:dist[i].Adress[0]},dist[i],k.toString());
      k = k+1;
      }
      else{
        if(dist[i].email!=host.email){
          infoMap(map,{lat:dist[i].Adress[1],lng:dist[i].Adress[0]},dist[i],'O');
        }

      }
    }

  }

  google.maps.event.addDomListener(window, 'load', initialize);


  function infoMap(map,location,inform,label) {
    var contentString = '<div id="content">'+
        '<div id="siteNotice">'+
        '</div>'+
        '<h3 id="firstHeading" class="firstHeading">'+inform.email+'</h3>'+
        '<div id="bodyContent">'+
        '<p>Sex: '+inform.sex+'</p>'+
        '<p>Age: '+inform.age+'</p>'+
        '<p>Sports: '+inform.sports+'</p>'+
        '<p>Skill Degree: '+inform.skill+'</p>'+
        '<p >Distance Level: '+Math.round(inform.dist*1000)+' </p>'+
        '<p><a href="/view/comment?username='+inform.email+'">Leave a message</a></p>'+
        '</div>';
    var infowindow = new google.maps.InfoWindow({
      content: contentString,
      maxWidth: 200
    });

    var marker = new google.maps.Marker({
      position: location,
      map: map,
      title: 'SportPartner',
      label: label
    });

    marker.addListener('click', function() {
      infowindow.open(map, marker);
    });

  }

</script>

<style>
  /* Always set the map height explicitly to define the size of the div
   * element that contains the map. */
  #map {
    height: 100%;
  }
  /* Optional: Makes the sample page fill the window. */
  html, body {
    height: 100%;
    margin-top: 20px;
    padding: 0;
  }
</style>
