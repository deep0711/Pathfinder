/*function startp() {

    var xi = strt.i;
    var yi = strt.j;
    $(document).on("mousemove" , function(event){
        console.log("Moving!!");
    });

    $(document).on("mouseup" , function(event) {

        var xf = Math.floor(mouseX / w);
        var yf = Math.floor(mouseY / h);

        grid[xi][yi].wall = true;
        grid[xi][yi].showyou(color(255));

        grid[xf][yf].wall = false;
        grid[xf][yf].showyou(color( 0 ,255  , 0));

        strt.i = xf;
        strt.j = yf;

        $(this).unbind("mouseup , mousemove");
        return;
    });
}*/


$(document).on("mousedown", function(event) {

    var xc = Math.floor(mouseX / w);
    var yc = Math.floor(mouseY / h);

    if (grid[xc][yc] != start && grid[xc][yc] != end) {

        grid[xc][yc].wall = true;
        grid[xc][yc].showyou(color(255));
        $(document).on("mousemove", function(ev) {

            var xc = Math.floor(mouseX / w);
            var yc = Math.floor(mouseY / h);

            if (grid[xc][yc] != start && grid[xc][yc] != end) {
                grid[xc][yc].wall = true;
                grid[xc][yc].showyou(color(255));
            }

        });
        $(document).on("mouseup", function(e) {
            //console.log("Running!!");
            $(this).unbind("mouseup mousemove");
        });
    } else {
        console.log("Function Loading !!! ");
    }


});