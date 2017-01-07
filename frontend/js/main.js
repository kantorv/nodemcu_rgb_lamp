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
    })
})