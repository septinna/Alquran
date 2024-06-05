$(document).ready(function() {
    var firebaseUrl = "https://al-quran-8d642.firebaseio.com/data.json?print=pretty";
    var audio = $('#audio')[0];
  
    function fetchSurahDetails(surahIndex) {
        $.ajax({
            url: firebaseUrl,
            type: "GET",
            beforeSend: function() {
                swal({
                    title: "",
                    text: "Mencari data...",
                    icon: "https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif",
                    button: false,
                    closeOnClickOutside: false,
                    closeOnEsc: false
                });
            },
            success: function(response) {
                swal.close(); 
                var surahData = response[surahIndex];
                var surahDetails = '<h2>' + surahData.nama + '</h2>' +
                                   '<p><strong>Arti:</strong> ' + surahData.arti + '</p>' +
                                   '<p><strong>Asma:</strong> ' + surahData.asma + '</p>' +
                                   '<p><strong>Ayat:</strong> ' + surahData.ayat + '</p>' +
                                   '<p><strong>Keterangan:</strong> ' + surahData.keterangan+ '</p>';
                $('#surah-details').html(surahDetails);
                $('#audio').attr('src', surahData.audio);
                $('#play-button').show(); 
                $('#pause-button').hide(); 
                $('#stop-button').hide(); 
                var volume = $('#volume-range').val();
                audio.volume = volume;
                $('#volume-container').show(); 
                $('#current-time, #duration, #time-divider').show();
            },
            error: function(xhr, status, error) {
                console.error("Error:", error);
                swal("Oops!", "Terjadi kesalahan saat memuat data", "error");
            }
        });
    }
  
    $('#surah-dropdown').change(function() {
        var surahIndex = $(this).val();
        if (surahIndex !== "") {
            fetchSurahDetails(surahIndex);
            $('.audio-controls i').show();
            audio.pause(); 
        } else {
            $('#surah-details').html('');
            $('.audio-controls i').hide();
            $('#current-time, #duration, #time-divider').hide(); 
        }
    });
  
    $.ajax({
        url: firebaseUrl,
        type: "GET",
        beforeSend: function() {
            swal({
                title: "",
                text: "Memuat data...",
                icon: "https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif",
                button: false,
                closeOnClickOutside: false,
                closeOnEsc: false
            });
        },
        success: function(response) {
            swal.close(); 
           
            $.each(response, function(key, value) {
              var surahOption = '<option value="' + key + '">' + value.nomor + '. ' + value.nama + '</option>';
                $('#surah-dropdown').append(surahOption);
            });
        },
        error: function(xhr, status, error) {
            console.error("Error:", error);
            swal("Oops!", "Terjadi kesalahan saat memuat data", "error");
        }
    });
  
    // Fungsi untuk mengatur volume
    function setVolume(volume) {
        audio.volume = volume;
        if (volume === 0) {
            $('#mute-button').removeClass('fa-volume-up').addClass('fa-volume-mute');
        } else {
            $('#mute-button').removeClass('fa-volume-mute').addClass('fa-volume-up');
        }
    }
  
    // Mute atau unmute audio
    $('#mute-button').on('click', function() {
        if (audio.volume > 0) {
            setVolume(0); 
        } else {
            setVolume(0.5); 
        }
    });
  
    // Mengatur volume saat nilai input range berubah
    $('#volume-range').on('input', function() {
        var volume = $(this).val();
        setVolume(volume);
    });
  
    // Kontrol audio
    $('#play-button').on('click', function() {
        audio.play();
        $('#play-button').hide();
        $('#pause-button').show();
        $('#stop-button').show();
    });
  
    $('#pause-button').on('click', function() {
        audio.pause();
        $('#pause-button').hide();
        $('#stop-button').show();
        $('#play-button').show();
    });
  
    $('#stop-button').on('click', function() {
        audio.pause();
        audio.currentTime = 0;
        $('#pause-button').hide();
        $('#stop-button').hide();
        $('#play-button').show();
    });
  
    $('#rewind-button').on('click', function() {
        audio.currentTime -= 10; // Mundur 10 detik
    });
  
    $('#forward-button').on('click', function() {
        audio.currentTime += 10; // Maju 10 detik
    });
  
    audio.addEventListener('timeupdate', function() {
        var currentTime = audio.currentTime;
        var duration = audio.duration;
        var minutes = Math.floor(currentTime / 60);
        var seconds = Math.floor(currentTime % 60);
        var durationMinutes = Math.floor(duration / 60);
        var durationSeconds = Math.floor(duration % 60);
        var currentTimeFormatted = (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
        var durationFormatted = (durationMinutes < 10 ? '0' : '') + durationMinutes + ':' + (durationSeconds < 10 ? '0' : '') + durationSeconds;
        $('#current-time').text(currentTimeFormatted);
        $('#duration').text(durationFormatted);
    });
  
  });