$(document).ready(function(){
    console.log('ready');
    $('#custom').spectrum(
    {
        allowEmpty:true,
        change: function(color){
            $('#basic-log').text( color.toHexString()) }
    })
})