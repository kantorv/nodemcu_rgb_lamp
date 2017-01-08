$(document).ready(function(){

    var last_hex_value,
        picker_change_progress;

    console.log('ready 111');
    $('#custom').spectrum(
    {
        allowEmpty:true,
        change: function(color){
            var hex_value = color.toHexString();
            $.ajax({
                url : "/setcolor",
                type: "GET",
                data : {color:hex_value.replace('#','')},
                success : function(resp){
                    console.log('success', resp)
                },
                failure : function(data){
                    console.log('failure', data)
                }
            })
        }
    });




var setColor = function(hex_value){
    console.log("setColor called", hex_value)
    $.ajax({
            url : "/setcolor",
            type: "GET",
            data : {color:hex_value.replace('#','')},
            success : function(resp){
                console.log('setColor success', resp);
                 last_hex_value = hex_value;
            },
            failure : function(data){
                console.log('setColor failure', data)
            }
    })
}
$("#full").spectrum({
    allowEmpty:false,
    flat:true,
    color: "#ECC",
    showInput: true,
    className: "full-spectrum",
    clickoutFiresChange: true,
    showInitial: true,
    showPalette: true,
     showSelectionPalette: true,
      showButtons: false,
    //maxSelectionSize: 10,
    preferredFormat: "hex",
    localStorageKey: "spectrum.demo",
    move: function (color) {

    },
    show: function () {

    },
    beforeShow: function () {
         console.log("spectrum beforeShow called");
    },
    hide: function () {

    },
    change: function(color){
            console.log("spectrum change called",color);

            var hex_value, rgb_value ;
            if(color){
                hex_value = color.toHexString();
                if(hex_value == last_hex_value){
                    console.log("no changes, returning");
                    return true;
                }

             rgb_value = color.toRgb();
                picker_change_progress = true;
               $( "#red" ).slider( "value", rgb_value.r );
               $( "#green" ).slider( "value",  rgb_value.g );
                picker_change_progress = false;
               $( "#blue" ).slider( "value",  rgb_value.b )

            }

            else {
                 hex_value  = "#000000";  //black shuts rgb down
            }


            setColor(hex_value);
    },
    palette: [
        ["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",
        "rgb(204, 204, 204)", "rgb(217, 217, 217)","rgb(255, 255, 255)"],
        ["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
        "rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"],
        ["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)",
        "rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)",
        "rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)",
        "rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)",
        "rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)",
        "rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
        "rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
        "rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
        "rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)",
        "rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
    ]
});


    var req_in_progress = false,
        last_br_value = 0;

    $( "#slider" ).slider({
      min:0,
      max:100,
      value:100,
      slide: function( event, ui ) {
        console.log( ui.value );
        if(req_in_progress === true){
            console.log('req in progress');
            last_br_value = ui.value;
            return true;
        }
        req_in_progress = true;

        $.ajax({
            url : "/brightness",
            type: "POST",
            data : {brightness:ui.value},
            success : function(resp){
                console.log('success', resp);
            },
            error : function(data){
                console.log('failure', data)
            },
            complete  : function(data){
                console.log('complete', data);

            }

        }).done(function(e) {
           console.log( "/brightness req finished", e );
            req_in_progress = false;
        })
      }
    });


      function hexFromRGB(r, g, b) {
      var hex = [
        r.toString( 16 ),
        g.toString( 16 ),
        b.toString( 16 )
      ];
      $.each( hex, function( nr, val ) {
        if ( val.length === 1 ) {
          hex[ nr ] = "0" + val;
        }
      });
      return hex.join( "" ).toUpperCase();
    }


    function refreshSwatch() {
    console.log("refreshSwatch called", arguments)
      if(picker_change_progress){
        console.log("picker_change_progress is true, returning")
        return true;
      }
      //slide2_req_in_progress = true;
      var red = $( "#red" ).slider( "value" ),
        green = $( "#green" ).slider( "value" ),
        blue = $( "#blue" ).slider( "value" ),
        hex = hexFromRGB( red, green, blue );
      $( "#swatch" ).css( "background-color", "#" + hex );
      console.log("received:", red, green, blue, "\nhex:", hex, "\npicker_change_progress",picker_change_progress);
      $('#full').spectrum("set", hex) // seems spectrum's change is not being called if color wasn't changed



    }

/*

    function refreshSwatchSlide() {
    console.log("refreshSwatchSlide called", arguments)
      if(picker_change_progress){
        console.log("picker_change_progress is true, returning")
        return true;
      }
      //slide2_req_in_progress = true;
      var red = $( "#red" ).slider( "value" ),
        green = $( "#green" ).slider( "value" ),
        blue = $( "#blue" ).slider( "value" ),
        hex = hexFromRGB( red, green, blue );
      $( "#swatch" ).css( "background-color", "#" + hex );
      console.log("received:", red, green, blue, "\nhex:", hex, "\npicker_change_progress",picker_change_progress);



    }
    */


    $( "#red, #green, #blue" ).slider({
      orientation: "horizontal",
      range: "min",
      max: 255,
      value: 127,
     // slide: refreshSwatchSlide,
      change: refreshSwatch
    });
   // $( "#red" ).slider( "value", 255 );
   // $( "#green" ).slider( "value", 140 );
  //  $( "#blue" ).slider( "value", 60 );




});