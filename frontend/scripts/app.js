// ------------------------
// Color ------------------
// ------------------------
var minutes_to_HSV = {

    total_minutes : (60*24),

    current_minutes : function() {
        // var d = new Date();
        // return (d.getHours() * 60) + d.getMinutes();

        var now = moment();
        return (now.hours()*60) + now.minutes();
    },

    H : function(current_m) {
        var hue = 0; // default hue
        var half_m = this.total_minutes/2;

        if (current_m < half_m) {
            hue = (current_m*360)/(half_m);
        } else {
            _min = current_m - (half_m);
            hue = 360 - ((_min*360)/(half_m));
        }
        return hue;
    },

    S : function(current_m) {
        var saturation = 100; // default saturation
        var half_m = this.total_minutes/2;

        if ( current_m < 100 ) {
            saturation = current_m;
        }
        if ( current_m > (half_m-100) && current_m <= half_m ) {
            saturation = 100 - (current_m - (half_m-100));
        }
        if ( current_m > half_m && current_m < (half_m+100) ) {
            saturation = current_m - half_m;
        }
        if ( current_m > this.total_minutes-100 ) {
            saturation = 100 - (current_m - (this.total_minutes-100));
        }
        return saturation;
    },

    V : function(current_m) {

        var value = 100; // default value (06.00 to 18.00 at 100%)
        if ( current_m < (6*60) ) { // 0.00 to 6.00 ascending to 100%
            value = (current_m*100) / (6*60);
        }
        if ( current_m > 18*60 ) { // 18.00 to 24.00 descending to 0%
            var _m = current_m - (18*60);
            value = 100 - ((_m*100) / (6*60));
        }
        return value;
    },

    HSV : function(m) {
        var min = m || this.current_minutes();
        var output = {
            'h' : this.H(min),
            's' : this.S(min),
            'v' : this.V(min)
        }
        return output;
    }
};

(function update_color() {

    var _hsv = minutes_to_HSV.HSV();
    var color = tinycolor("hsv("+_hsv.h+", "+_hsv.s+"%, "+_hsv.v+"%)");
    var color_hex = color.toHexString();
    var color_rgb = color.toRgb();

    $('#app, #the-info').css('background-color', color_hex);

    if ( color.isLight() ) {
        $('body').removeClass('dark');
        $('body').addClass('light');
    } else {
        $('body').removeClass('light');
        $('body').addClass('dark');
    }

    // clock output
    var clock_output_string = 'HSV : <strong>'+Math.round(_hsv.h)+'&deg;, '+Math.round(_hsv.s)+'%, '+Math.round(_hsv.v)+'%</strong>';
        clock_output_string += '<br />HEX : <strong>'+ color_hex.toUpperCase() +'</strong>';
        clock_output_string += '<br />RGB : <strong>'+ color_rgb.r + ', '+ color_rgb.g +', '+ color_rgb.b +'</strong>';
    $('#output-color').html(clock_output_string);

    setTimeout(update_color, 1000);
})();


// ------------------------
// Clock ------------------
// ------------------------
var s_loop = 0;
var m_loop = 0;
var h_loop = 0;

(function update_clock() {
    var now = moment().format("hhmmssdA");
    var deg_s = (360/60*(now[4]+now[5])) + (s_loop*360);
    var deg_m =  360/60*(now[2]+now[3]);
    var deg_h =  360/12*(now[0]+now[1]);
    if (deg_s - (s_loop*360) == 354) { s_loop++ }

	$('#clock-sec').css({
        "-webkit-transform": "rotate(" + deg_s + "deg)",
        "-moz-transform": "rotate(" + deg_s + "deg)",
        "transform": "rotate(" + deg_s + "deg)"
    });

	$('#clock-min').css({
        "-webkit-transform": "rotate(" + deg_m + "deg)",
        "-moz-transform": "rotate(" + deg_m + "deg)",
        "transform": "rotate(" + deg_m + "deg)"
    });

	$('#clock-hour').css({
        "-webkit-transform": "rotate(" + deg_h + "deg)",
        "-moz-transform": "rotate(" + deg_h + "deg)",
        "transform": "rotate(" + deg_h + "deg)"
    });

    // clock output
    $('#output-time').html( now[0]+now[1] + ':' + now[2]+now[3] + ':' + now[4]+now[5] + ' ' + now[7]+now[8] );

    setTimeout(update_clock, 1000);
})();


// ------------------------
// Menu  ------------------
// ------------------------
var info_open = false;
$('#info-block header').on('click', function(e) {
    e.preventDefault();
    if ( info_open === false ) {
        $('#info-block').removeClass('closed');
        $('#info-block').addClass('open');
        info_open = true;
    } else {
        $('#info-block').removeClass('open');
        $('#info-block').addClass('closed');
        info_open = false;
    }
});

// ------------------------
// Toggle Clock  ----------
// ------------------------
var analog = true;
$('#main-block').on('click', function() {
    console.log( analog );
    if ( analog === true ) {
        $('#clock').css('opacity', 0);
        $('#clock-output').css('opacity', 1);
        analog = false;
    } else {
        $('#clock').css('opacity', 1);
        $('#clock-output').css('opacity', 0);
        analog = true;
    }
});
