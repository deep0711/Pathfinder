
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


$(document).on("mousedown" , function(event) {

    //Finding Cell Coordinates!
    
    //X- coordinate
    var xc = Math.floor(mouseX / w);

    //Y- coordinate
    var yc = Math.floor(mouseY / h);

    /**
     * Check if the cell is currently a wall!
     */
    if(grid[xc][yc].wall == false) {

        //Check if the current cell is not Souce and Destination
        if(grid[xc][yc] != strt && grid[xc][yc] != end) {
        
            //If only pressed then also make the Cell a obstacle
            grid[xc][yc].wall = true;
            
            //Color the Cell
            grid[xc][yc].showyou(color(255));
    
            /**
             * If the mouse is pressed and moved
             * make every cell a obstacles excluding Sources and Destination
             */
            $(document).on("mousemove" , function(ev) {
    
                var xc = Math.floor(mouseX / w);
                var yc = Math.floor(mouseY / h);
                
                if(grid[xc][yc] != strt && grid[xc][yc] != end) {
    
                    grid[xc][yc].wall = true;
                    grid[xc][yc].showyou(color(255));
                }
            });
    
            $(document).on("mouseup" , function(e) {
                //Stop the mousemove and mouseup
                //Ready for Another MouseClick and MouseMove
                $(this).unbind("mouseup mousemove");
            });
            
        }
        else {
            //The Current Cell is Source or Dstination
            //Move the Source or Destination Position 
            console.log("Moving!!!");
        } 
    }
    else {
        //If the Cell is a Obstacle then it can't be Souce or Destination
        grid[xc][yc].wall = false;
        grid[xc][yc].showyou(color(255));
        $(document).on("mousemove" , function(event) {

            //Current Cordinates of cell on which the mouse is!
            var xc = Math.floor(mouseX / w);
            var yc = Math.floor(mouseY / h);

            grid[xc][yc].wall = false;
            grid[xc][yc].showyou(color(255));
            
        });
        $(document).on("mouseup" , function(event){
            $(this).unbind("mouseup mousemove");
        });
    }

});
