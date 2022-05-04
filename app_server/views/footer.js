<script>

	var today = new Date();
	var today = today.toLocaleTimeString();
	document.getElementById('time').innerHTML=today;


    var lastmodified = new Date(document.lastModified);
    document.getElementById("lastmodified").innerHTML = lastmodified.toLocaleDateString();

</script>
