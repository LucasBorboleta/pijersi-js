"use strict";
/* PIJERSI-JS-COPYRIGHT-MD-BEGIN
# COPYRIGHT

The software PIJERSI-JS implements the rules of PIJERSI, which is an abstract/strategy board game. This copyright notice only covers the software PIJERSI-JS. The copyright of the PIJERSI rules and board game concept can be found at https://github.com/LucasBorboleta/pijersi.

Copyright (C) 2025 Lucas Borboleta (lucas.borboleta@free.fr).

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see <http://www.gnu.org/licenses>.

PIJERSI-JS-COPYRIGHT-MD-END */
///////////////////////////////////////////////////////////////////////////////
pijersi.draw = { };
pijersi.draw.__initModuleCalled = false;

pijersi.draw.__initModule = function(){

    if ( pijersi.draw.__initModuleCalled ) return;
    pijersi.draw.__initModuleCalled = true;

    // Init required modules
    pijersi.debug.__initModule();
    pijersi.rules.__initModule();

    // Init inner classes
    // None

    pijersi.draw.draw_zone = document.getElementById( "pijersi_drawZone" );

    pijersi.draw.audio_slide = document.getElementById( "pijersi_audio_slide" );
    pijersi.draw.audio_click_light = document.getElementById( "pijersi_audio_clickLight" );
    pijersi.draw.audio_click_dark = document.getElementById( "pijersi_audio_clickDark" );
    pijersi.draw.audio_click_dark_filtered = document.getElementById( "pijersi_audio_clickDarkFiltered" );

    {
        const width_height_ratio = pijersi.draw.draw_zone.clientWidth/pijersi.draw.draw_zone.clientHeight;
        const width_height_ratio_error = Math.abs(width_height_ratio - 3*Math.sqrt(3)/4)
        pijersi.debug.assert(width_height_ratio_error <= 0.001, "drawZone: width_height_ratio");
    }

    pijersi.draw.board_width = pijersi.draw.draw_zone.clientWidth;

    pijersi.draw.hexagon_width = pijersi.draw.board_width/12;
    pijersi.draw.hexagon_height = pijersi.draw.hexagon_width*2*Math.sqrt(3)/3;
    pijersi.draw.hexagon_side = pijersi.draw.hexagon_height/2;
    pijersi.draw.hexagon_epsilon = 0;

    pijersi.draw.hexagon_epsilon = 4;
    pijersi.draw.cube_size = (pijersi.draw.hexagon_height - pijersi.draw.hexagon_epsilon)/(2 + Math.sqrt(3)/3);
    pijersi.draw.hexagon_width = pijersi.draw.hexagon_width;
    pijersi.draw.hexagon_height = pijersi.draw.hexagon_height;

    pijersi.draw.CubeDivLocation = { BOTTOM:0, MIDDLE:1, TOP:2 };

    pijersi.draw.cube_div_classes = []
    pijersi.draw.cube_div_classes[pijersi.rules.CubeColor.WHITE] = []
    pijersi.draw.cube_div_classes[pijersi.rules.CubeColor.WHITE][pijersi.rules.CubeSort.FOOL] = 'pijersi_cube_fool_white_class';
    pijersi.draw.cube_div_classes[pijersi.rules.CubeColor.WHITE][pijersi.rules.CubeSort.KING] = 'pijersi_cube_king_white_class';
    pijersi.draw.cube_div_classes[pijersi.rules.CubeColor.WHITE][pijersi.rules.CubeSort.MOUNTAIN] = 'pijersi_cube_mountain_white_class';
    pijersi.draw.cube_div_classes[pijersi.rules.CubeColor.WHITE][pijersi.rules.CubeSort.PAPER] = 'pijersi_cube_paper_white_class';
    pijersi.draw.cube_div_classes[pijersi.rules.CubeColor.WHITE][pijersi.rules.CubeSort.ROCK] = 'pijersi_cube_rock_white_class';
    pijersi.draw.cube_div_classes[pijersi.rules.CubeColor.WHITE][pijersi.rules.CubeSort.SCISSORS] = 'pijersi_cube_scissors_white_class';
    pijersi.draw.cube_div_classes[pijersi.rules.CubeColor.WHITE][pijersi.rules.CubeSort.WISE] = 'pijersi_cube_wise_white_class';
    pijersi.draw.cube_div_classes[pijersi.rules.CubeColor.BLACK] = []
    pijersi.draw.cube_div_classes[pijersi.rules.CubeColor.BLACK][pijersi.rules.CubeSort.FOOL] = 'pijersi_cube_fool_black_class';
    pijersi.draw.cube_div_classes[pijersi.rules.CubeColor.BLACK][pijersi.rules.CubeSort.KING] = 'pijersi_cube_king_black_class';
    pijersi.draw.cube_div_classes[pijersi.rules.CubeColor.BLACK][pijersi.rules.CubeSort.MOUNTAIN] = 'pijersi_cube_mountain_black_class';
    pijersi.draw.cube_div_classes[pijersi.rules.CubeColor.BLACK][pijersi.rules.CubeSort.PAPER] = 'pijersi_cube_paper_black_class';
    pijersi.draw.cube_div_classes[pijersi.rules.CubeColor.BLACK][pijersi.rules.CubeSort.ROCK] = 'pijersi_cube_rock_black_class';
    pijersi.draw.cube_div_classes[pijersi.rules.CubeColor.BLACK][pijersi.rules.CubeSort.SCISSORS] = 'pijersi_cube_scissors_black_class';
    pijersi.draw.cube_div_classes[pijersi.rules.CubeColor.BLACK][pijersi.rules.CubeSort.WISE] = 'pijersi_cube_wise_black_class';

    pijersi.draw.hexagons_div = [];
    pijersi.draw.cubes_div = [];

    pijersi.draw.hexagons = [];

    pijersi.draw.labels_are_displayed = true;

    // Debug the mouse position when inside the drawZone
    pijersi.draw.draw_zone.addEventListener( "mousemove" ,
        function(event){
            const mouse_position = pijersi.draw.getMousePosition(event);
            pijersi.debug.writeMousePosition(Math.floor(mouse_position.x), Math.floor(mouse_position.y));
        },
        false);

    pijersi.draw.draw_zone.addEventListener( "click" , pijersi.draw.onHexagonClick, false);

    pijersi.debug.writeMessage( "pijersi.draw.__initModule(): done" );
};

// --- PIJERSI_BEGIN: commands ---

pijersi.draw.onHexagonClick = function(event){

    const mouse_position = pijersi.draw.getMousePosition(event);
    const x = mouse_position.x;
    const y = mouse_position.y;

    for ( const hexagon of pijersi.draw.hexagons ) {

        let mouse_inside_hexagon = false;

        if ( x > hexagon.north_west.x + pijersi.draw.hexagon_epsilon && x < hexagon.north_east.x - pijersi.draw.hexagon_epsilon &&
             y > hexagon.north.y + pijersi.draw.hexagon_epsilon && y < hexagon.south.y - pijersi.draw.hexagon_epsilon ) {

            if ( y >= hexagon.north_west.y && y <= hexagon.south_west.y ) {
                mouse_inside_hexagon = true;

            } else if ( y <= hexagon.north_west.y && x <= hexagon.north.x ) {
                const y_limit = hexagon.north_west.y +
                                (hexagon.north.y - hexagon.north_west.y)/(hexagon.north.x - hexagon.north_west.x)*(x - hexagon.north_west.x);
                mouse_inside_hexagon = (y > y_limit);

            } else if ( y <= hexagon.north_west.y && x > hexagon.north.x ) {
                const y_limit = hexagon.north.y +
                                (hexagon.north_east.y - hexagon.north.y)/(hexagon.north_east.x - hexagon.north.x)*(x - hexagon.north.x);
                mouse_inside_hexagon = (y > y_limit);

            } else if ( y >= hexagon.south_west.y && x <= hexagon.north.x ) {
                const y_limit = hexagon.south_west.y +
                                (hexagon.south.y - hexagon.south_west.y)/(hexagon.south.x - hexagon.south_west.x)*(x - hexagon.south_west.x);
                mouse_inside_hexagon = (y < y_limit);

            } else if ( y >= hexagon.south_west.y && x > hexagon.north.x ) {
                const y_limit = hexagon.south.y +
                                (hexagon.south_east.y - hexagon.south.y)/(hexagon.south_east.x - hexagon.south.x)*(x - hexagon.south.x);
                mouse_inside_hexagon = (y < y_limit);
            }
        }

        if ( mouse_inside_hexagon ) {
            pijersi.presenter.selectHexagon(hexagon.hexagon_index);
            break;
        }
    }
};

pijersi.draw.playMoveSound = function(){
    //pijersi.draw.playSlideSound();
    //pijersi.draw.playSoundClickLight();
    //pijersi.draw.playSoundClickDark(); // A bit of noisy tail
    pijersi.draw.playSoundClickDarkFiltered(); // My favorite
};

pijersi.draw.playRestartSound = function(){
    pijersi.draw.playSlideSound();
};

pijersi.draw.playSoundClickLight = function(){
    pijersi.draw.audio_click_light.currentTime = 0.6 * pijersi.draw.audio_click_light.duration;
    pijersi.draw.audio_click_light.volume = 0.20;
    pijersi.draw.audio_click_light.play();
};

pijersi.draw.playSoundClickDark = function(){
    pijersi.draw.audio_click_dark.currentTime = 0.7 * pijersi.draw.audio_click_dark.duration;
    pijersi.draw.audio_click_dark.volume = 0.40;
    pijersi.draw.audio_click_dark.play();
};

pijersi.draw.playSoundClickDarkFiltered = function(){
    pijersi.draw.audio_click_dark_filtered.currentTime = 0.75 * pijersi.draw.audio_click_dark_filtered.duration;
    pijersi.draw.audio_click_dark_filtered.volume = 1.00;
    pijersi.draw.audio_click_dark_filtered.play();
};

pijersi.draw.playSlideSound = function(){
    pijersi.draw.audio_slide.currentTime = 0.4 * pijersi.draw.audio_slide.duration;
    pijersi.draw.audio_slide.volume = 0.40;
    pijersi.draw.audio_slide.play();
};

pijersi.draw.playUndoSound = function(){
    pijersi.draw.playSlideSound();
};

// --- PIJERSI_END: commands ---

// --- PIJERSI_BEGIN: makers ---

pijersi.draw.makeAllHexagonsDiv = function(){

    for ( const hexagon of pijersi.rules.hexagons ) {
        pijersi.draw.hexagons_div.push(pijersi.draw.makeHexagonDiv(hexagon));
    }
    pijersi.draw.toogleHexagonDivNames();
};

pijersi.draw.makeHexagonDiv = function(hexagon){

    const hexagon_div = document.createElement("DIV");
    hexagon_div.id = "pijersi_hexagon_" + hexagon.name;

    const x_central_hexagon = 6*pijersi.draw.hexagon_width;
    const y_central_hexagon = 5/2*pijersi.draw.hexagon_height + 3*pijersi.draw.hexagon_side;

    const x_hexagon = x_central_hexagon + (hexagon.u + hexagon.v/2)*pijersi.draw.hexagon_width;
    const y_hexagon = y_central_hexagon - hexagon.v*Math.sqrt(3)/2*pijersi.draw.hexagon_width;

    let x_shift = 0;
    if ( hexagon.reserve ) {
        if ( hexagon.name === 'a' || hexagon.name === 'b' || hexagon.name === 'c' || hexagon.name === 'd' ) {
            x_shift = pijersi.draw.hexagon_width/2;
        } else if ( hexagon.name === 'i' || hexagon.name === 'h' || hexagon.name === 'g' || hexagon.name === 'f' ) {
            x_shift = -pijersi.draw.hexagon_width/2;
        }
    }

    const x_hexagon_div = x_hexagon - pijersi.draw.hexagon_width/2 + x_shift; // hexagon left
    const y_hexagon_div = y_hexagon - pijersi.draw.hexagon_height/2; // hexagon top

    hexagon_div.style.left = Math.floor(x_hexagon_div) + "px";
    hexagon_div.style.top = Math.floor(y_hexagon_div) + "px";

    hexagon_div.style.width = Math.floor(pijersi.draw.hexagon_width) + "px";
    hexagon_div.style.height = Math.floor(pijersi.draw.hexagon_height) + "px";

    hexagon_div.className = "pijersi_hexagon_class";
    hexagon_div.className += " " + "pijersi_hexagon_unselected_class";

    if ( ! hexagon.reserve ) {
        const hexagon_text = document.createTextNode(hexagon.name);

        const hexagon_paragraph = document.createElement("P");
        hexagon_paragraph.className  = "pijersi_hexagon_name_class";
        hexagon_paragraph.appendChild(hexagon_text);

        hexagon_div.appendChild(hexagon_paragraph);
    }

    pijersi.draw.draw_zone.appendChild(hexagon_div);

    {
        const hexagon_x_min = x_hexagon_div;
        const hexagon_x_max = x_hexagon_div + pijersi.draw.hexagon_width;

        const hexagon_y_min = y_hexagon_div;
        const hexagon_y_max = y_hexagon_div + pijersi.draw.hexagon_height;

        const hexagon_y_first = (hexagon_y_min + hexagon_y_max)/2 - pijersi.draw.hexagon_side/2;
        const hexagon_y_second = (hexagon_y_min + hexagon_y_max)/2 + pijersi.draw.hexagon_side/2;

        const draw_hexagon = {
            hexagon_index:hexagon.index,

            north:{x:(hexagon_x_min + hexagon_x_max)/2, y:hexagon_y_min},
            south:{x:(hexagon_x_min + hexagon_x_max)/2, y:hexagon_y_max},

            north_west:{x:hexagon_x_min, y:hexagon_y_first},
            north_east:{x:hexagon_x_max, y:hexagon_y_first},

            south_west:{x:hexagon_x_min, y:hexagon_y_second},
            south_east:{x:hexagon_x_max, y:hexagon_y_second}
        };

        pijersi.draw.hexagons.push(draw_hexagon);
    }

    return hexagon_div;
};

pijersi.draw.makeAllCubesDiv = function(){

    for ( const hexagon of pijersi.rules.hexagons ) {

        const cube_div_prefix = hexagon.name;
        const hexagon_div_index = hexagon.index;
        const hexagon_div = pijersi.draw.hexagons_div[hexagon_div_index]

        pijersi.draw.cubes_div[hexagon_div_index] = [];

        for ( const cube_div_location of Object.values(pijersi.draw.CubeDivLocation) ) {
            pijersi.draw.cubes_div[hexagon_div_index].push(pijersi.draw.makeCubeDiv(hexagon_div, cube_div_location, cube_div_prefix));
        }
    }
};

pijersi.draw.makeCubeDiv = function(hexagon_div, cube_div_location, cube_div_prefix){

    const cube_div_suffix = Object.keys(pijersi.draw.CubeDivLocation)[cube_div_location];
    const cube_left = (pijersi.draw.hexagon_width - pijersi.draw.cube_size)/2;
    let cube_top = 0;

    if ( cube_div_location === pijersi.draw.CubeDivLocation.BOTTOM ) {
        cube_top = (pijersi.draw.hexagon_height + pijersi.draw.hexagon_epsilon)/2;

    } else if ( cube_div_location === pijersi.draw.CubeDivLocation.MIDDLE ) {
        cube_top = (pijersi.draw.hexagon_height - pijersi.draw.cube_size)/2;

    } else if ( cube_div_location === pijersi.draw.CubeDivLocation.TOP ) {
        cube_top = (pijersi.draw.hexagon_height - pijersi.draw.hexagon_epsilon - 2*pijersi.draw.cube_size)/2;
    }

    const cube_div = document.createElement("DIV");
    cube_div.id = "pijersi_cube_"  + cube_div_prefix + "_" + cube_div_suffix

    cube_div.style.left = Math.floor(cube_left) + "px";
    cube_div.style.top = Math.floor(cube_top) + "px";
    cube_div.style.width = Math.floor(pijersi.draw.cube_size) + "px";
    cube_div.style.height = Math.floor(pijersi.draw.cube_size) + "px";

    pijersi.draw.clearCubeDiv(cube_div);

    hexagon_div.appendChild(cube_div);
    return cube_div;
};

// --- PIJERSI_END: makers ---

// --- PIJERSI_BEGIN: getters ---

pijersi.draw.getMousePosition = function(event){
    const drawZoneRectangle = pijersi.draw.draw_zone.getBoundingClientRect();
    return {
        x: event.clientX - drawZoneRectangle.left,
        y: event.clientY - drawZoneRectangle.top
    };
};

// --- PIJERSI_END: getters ---

// --- PIJERSI_BEGIN: setters ---

pijersi.draw.clearCubeDiv = function(cube_div){
    pijersi.draw.setCubeDivClass(cube_div, "pijersi_cube_class" +  " " + "pijersi_cube_unselected_class" +
        " " + "pijersi_cube_void_class"  );
};

pijersi.draw.hideElement = function(element){ element.style.display = "none";}

pijersi.draw.selectHexagonDiv = function(hexagon, condition){

    const hexagon_div = pijersi.draw.hexagons_div[hexagon.index];

    if ( condition ) {
        hexagon_div.className = hexagon_div.className.replace("pijersi_hexagon_unselected_class", "pijersi_hexagon_selected_class")
    } else {
        hexagon_div.className = hexagon_div.className.replace("pijersi_hexagon_selected_class", "pijersi_hexagon_unselected_class")
    }
};

pijersi.draw.selectHexagonCubeDiv = function(hexagon, condition){
    pijersi.debug.assert( pijersi.rules.hexagonHasCube(hexagon), "hexagon_source has cube");

    const hexagon_state = pijersi.rules.hexagons_states[hexagon.index];

    if ( hexagon_state.top !== null ) {
        const cube_div_top = pijersi.draw.cubes_div[hexagon.index][pijersi.draw.CubeDivLocation.TOP];
        pijersi.draw.selectCubeDiv(cube_div_top, condition);

    } else {
        const cube_div_middle = pijersi.draw.cubes_div[hexagon.index][pijersi.draw.CubeDivLocation.MIDDLE];
        pijersi.draw.selectCubeDiv(cube_div_middle, condition);
    }
};

pijersi.draw.selectCubeDiv = function(cube_div, condition){
    if ( condition ) {
        cube_div.className = cube_div.className.replace("pijersi_cube_unselected_class", "pijersi_cube_selected_class")
    } else {
        cube_div.className = cube_div.className.replace("pijersi_cube_selected_class", "pijersi_cube_unselected_class")
    }
};

pijersi.draw.selectHexagonStackDiv = function(hexagon, condition){
    pijersi.debug.assert( pijersi.rules.hexagonHasStack(hexagon), "hexagon_source has stack");

    const cube_div_top = pijersi.draw.cubes_div[hexagon.index][pijersi.draw.CubeDivLocation.TOP];
    pijersi.draw.selectCubeDiv(cube_div_top, condition);

    const cube_div_bottom = pijersi.draw.cubes_div[hexagon.index][pijersi.draw.CubeDivLocation.BOTTOM];
    pijersi.draw.selectCubeDiv(cube_div_bottom, condition);
};

pijersi.draw.setCubeDiv = function(cube_div, cube_color, cube_sort){
    const cube_class = "pijersi_cube_class" + " " + "pijersi_cube_unselected_class" +
                        " " + pijersi.draw.cube_div_classes[cube_color][cube_sort];
    pijersi.draw.setCubeDivClass(cube_div, cube_class);
};

pijersi.draw.setCubeDivClass = function(cube_div, cube_class){
    cube_div.className = cube_class;
};

pijersi.draw.showElement = function(element){ element.style.display = "inherit";}

pijersi.draw.updateAllHexagonsDiv = function(){

    for ( const hexagon of pijersi.rules.hexagons ) {
        pijersi.draw.updateHexagonDiv(hexagon);
    }
};

pijersi.draw.toogleHexagonDivNames = function(){

    const label_elements = document.getElementsByClassName("pijersi_hexagon_name_class");

    pijersi.draw.labels_are_displayed = ! pijersi.draw.labels_are_displayed;

    if ( pijersi.draw.labels_are_displayed ) {
        Array.from(label_elements).forEach(pijersi.draw.showElement);
    } else {
        Array.from(label_elements).forEach(pijersi.draw.hideElement);
    }
};

pijersi.draw.updateHexagonDiv = function(hexagon){

    const hexagon_div_index = hexagon.index;

    const cube_div_top = pijersi.draw.cubes_div[hexagon_div_index][pijersi.draw.CubeDivLocation.TOP];
    const cube_div_middle = pijersi.draw.cubes_div[hexagon_div_index][pijersi.draw.CubeDivLocation.MIDDLE];
    const cube_div_bottom = pijersi.draw.cubes_div[hexagon_div_index][pijersi.draw.CubeDivLocation.BOTTOM];

    const hexagon_state = pijersi.rules.hexagons_states[hexagon.index];

    if ( hexagon_state.bottom === null && hexagon_state.top === null ) {
        pijersi.draw.clearCubeDiv(cube_div_top);
        pijersi.draw.clearCubeDiv(cube_div_middle);
        pijersi.draw.clearCubeDiv(cube_div_bottom);

    } else if  ( hexagon_state.bottom !== null && hexagon_state.top === null ) {
        pijersi.draw.clearCubeDiv(cube_div_top);
        pijersi.draw.setCubeDiv(cube_div_middle, hexagon_state.bottom.color, hexagon_state.bottom.sort);
        pijersi.draw.clearCubeDiv(cube_div_bottom);

    } else if  ( hexagon_state.bottom !== null && hexagon_state.top !== null ) {
        pijersi.draw.setCubeDiv(cube_div_top, hexagon_state.top.color, hexagon_state.top.sort);
        pijersi.draw.clearCubeDiv(cube_div_middle);
        pijersi.draw.setCubeDiv(cube_div_bottom, hexagon_state.bottom.color, hexagon_state.bottom.sort);

    } else {
        pijersi.debug.assert(false, "pijersi.draw.updateHexagonDiv(): failed");
    }
};

// --- PIJERSI_END: setters ---

///////////////////////////////////////////////////////////////////////////////
