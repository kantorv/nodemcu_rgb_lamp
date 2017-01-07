$(document).ready(function(){
    console.log('ready');
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


$("#full").spectrum({
    allowEmpty:true,
    flat:true,
    color: "#ECC",
    showInput: true,
    className: "full-spectrum",
    showInitial: true,
    showPalette: true,
    showSelectionPalette: true,
    maxSelectionSize: 10,
    preferredFormat: "hex",
    localStorageKey: "spectrum.demo",
    move: function (color) {

    },
    show: function () {

    },
    beforeShow: function () {

    },
    hide: function () {

    },
    change: function(color){
            console.log(color);
            var hex_value  = "#000000";  //black shuts rgb down
            if(color){
                hex_value = color.toHexString();
            }


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



    $( "#slider" ).slider({
      slide: function( event, ui ) {
        console.log( ui.value );
        $.ajax({
            url : "/brightness",
            type: "POST",
            data : {brightness:ui.value},
            success : function(resp){
                console.log('success', resp)
            },
            failure : function(data){
                console.log('failure', data)
            }
        })
      }
    })


})