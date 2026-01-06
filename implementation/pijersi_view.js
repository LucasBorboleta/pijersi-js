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
pijersi.view = { };
pijersi.view.__init_called = false;

pijersi.view.__init = function(){

    if ( pijersi.view.__init_called ) return;
    pijersi.view.__init_called = true;

    // Init the required sub-modules
    pijersi.debug.__init();
    pijersi.math.__init();

    // Init the sub-module constants

    pijersi.view.const = {};

    pijersi.view.const.MOUSE_DEBUG = document.getElementById("pijersi-view-mouse-debug-id");
    pijersi.view.const.OTHER_DEBUG = document.getElementById("pijersi-view-other-debug-id");

    pijersi.view.const.BODY = document.getElementById("pijersi-view-body-id");

    pijersi.view.const.BOARD = document.getElementById("pijersi-view-board-id");

    pijersi.view.const.CREDIT = document.getElementById("pijersi-view-credit-id");
 	
    pijersi.view.const.MENU_ITEMS = document.getElementById("pijersi-view-menu-items-id");

    pijersi.view.const.TITLE = document.getElementById("pijersi-view-title-id");	
    pijersi.view.const.LEGEND = document.getElementById("pijersi-view-legend-id");	

    pijersi.view.const.BLACK_TURN = document.getElementById("pijersi-view-black-turn-id");
    pijersi.view.const.WHITE_TURN = document.getElementById("pijersi-view-white-turn-id");

    // "multi-func buttons" allows compact layout ; see also CSS at "#pijersi-view-body-grid-id" :
    //  - "left-multi-func-button" triggers either "show_previous_turn()" or "swap_blacks()"
    //  - "left-multi-func-button" triggers either "show_next_turn()" or "swap_whites()"
    pijersi.view.const.LEFT_MULTI_FUNC = document.getElementById("pijersi-view-left-multi-func-button-id");
    pijersi.view.const.RIGHT_MULTI_FUNC = document.getElementById("pijersi-view-right-multi-func-button-id");

    pijersi.view.const.CAPTURES = document.getElementById("pijersi-view-captures-id");

    pijersi.view.const.CAPTURE_BLACK_ROCKS = document.getElementById("pijersi-view-capture-black-rocks-id");
    pijersi.view.const.CAPTURE_BLACK_PAPERS = document.getElementById("pijersi-view-capture-black-papers-id");
    pijersi.view.const.CAPTURE_BLACK_SCISSORS = document.getElementById("pijersi-view-capture-black-scissors-id");
    pijersi.view.const.CAPTURE_BLACK_WISES = document.getElementById("pijersi-view-capture-black-wises-id");

    pijersi.view.const.CAPTURE_WHITE_ROCKS = document.getElementById("pijersi-view-capture-white-rocks-id");
    pijersi.view.const.CAPTURE_WHITE_PAPERS = document.getElementById("pijersi-view-capture-white-papers-id");
    pijersi.view.const.CAPTURE_WHITE_SCISSORS = document.getElementById("pijersi-view-capture-white-scissors-id");
    pijersi.view.const.CAPTURE_WHITE_WISES = document.getElementById("pijersi-view-capture-white-wises-id");

    pijersi.view.const.CAPTURE_GROUPS = [];

    pijersi.view.const.CAPTURE_GROUPS.push(pijersi.view.const.CAPTURE_BLACK_ROCKS);
    pijersi.view.const.CAPTURE_GROUPS.push(pijersi.view.const.CAPTURE_BLACK_PAPERS);
    pijersi.view.const.CAPTURE_GROUPS.push(pijersi.view.const.CAPTURE_BLACK_SCISSORS);
    pijersi.view.const.CAPTURE_GROUPS.push(pijersi.view.const.CAPTURE_BLACK_WISES);
    
    pijersi.view.const.CAPTURE_GROUPS.push(pijersi.view.const.CAPTURE_WHITE_ROCKS);
    pijersi.view.const.CAPTURE_GROUPS.push(pijersi.view.const.CAPTURE_WHITE_PAPERS);
    pijersi.view.const.CAPTURE_GROUPS.push(pijersi.view.const.CAPTURE_WHITE_SCISSORS);
    pijersi.view.const.CAPTURE_GROUPS.push(pijersi.view.const.CAPTURE_WHITE_WISES);

    pijersi.view.const.SHOW_STYLE = "pijersi-view-show-style";
    pijersi.view.const.HIDE_STYLE = "pijersi-view-hide-style";

    pijersi.view.const.PLAYER_TURN_EDIT_STYLE = "pijersi-view-player-turn-edit-style";
    pijersi.view.const.CREDIT_EDIT_STYLE = "pijersi-view-credit-edit-style";

    pijersi.view.const.BLACK_TURN_ON_STYLE = "pijersi-view-black-turn-on-style";
    pijersi.view.const.WHITE_TURN_ON_STYLE = "pijersi-view-white-turn-on-style";

    pijersi.view.const.SHOW_PREVIOUS_ON_STYLE = "pijersi-view-show-previous-on-style";
    pijersi.view.const.SHOW_NEXT_ON_STYLE = "pijersi-view-show-next-on-style";

    pijersi.view.const.SWAP_BLACKS_ON_STYLE = "pijersi-view-swap-blacks-on-syle";
    pijersi.view.const.SWAP_WHITES_ON_STYLE = "pijersi-view-swap-whites-on-syle";

    pijersi.view.const.CAPTURE_GROUP_EDIT_STYLE = "pijersi-view-capture-group-style";

    pijersi.view.const.HEXA_STYLE = "pijersi-view-hexagon-style";

    pijersi.view.const.HEXA_SHAPE_STYLE = "pijersi-view-hexagon-shape-style";

    pijersi.view.const.LABEL_BOX_STYLE = "pijersi-view-label-box-style";
    pijersi.view.const.LABEL_TEXT_STYLE = "pijersi-view-label-text-style";

    // >> All dimensions of board, hexagons and cubes are expressed in pixels
    // >> As resize of window could change such dimensions, 
    // >> those memorized dimensions should be understood as initial dimensions
    // >> and should be applied in % of the board dimensions when constructing DIV, etc.

    // Board x-y dimensions in hexagon width units
    // >> This formula is related to the construction of the background picture for the board
    pijersi.view.const.BOARD_NX = 7;
    pijersi.view.const.BOARD_NY = 11/Math.sqrt(3);

    // Check board x-y ratio and record its dimensions
    {
        const board_rectangle = pijersi.view.const.BOARD.getBoundingClientRect();
 
        const expected_ratio = pijersi.view.const.BOARD_NX / pijersi.view.const.BOARD_NY;
        const actual_ratio = board_rectangle.width / board_rectangle.height;

        if ( Math.abs(actual_ratio - expected_ratio) > 0.001 ) {
            pijersi.debug.log_error("unexpected 'actual_ratio' = " + actual_ratio + " ; expected_ratio = " + expected_ratio);
        };

        pijersi.view.const.BOARD_HEIGHT = board_rectangle.height;
        pijersi.view.const.BOARD_WIDTH = board_rectangle.width;
    }

    // Hexagon geometrical data
    pijersi.view.const.HEXA_VERTEX_COUNT = 6;
    pijersi.view.const.HEXA_SIDE_ANGLE = 2*Math.PI/pijersi.view.const.HEXA_VERTEX_COUNT;
    pijersi.view.const.HEXA_WIDTH = pijersi.view.const.BOARD_WIDTH/pijersi.view.const.BOARD_NX;
    pijersi.view.const.HEXA_SIDE = pijersi.view.const.HEXA_WIDTH*Math.tan(pijersi.view.const.HEXA_SIDE_ANGLE/2);
    pijersi.view.const.HEXA_HEIGHT = 2*pijersi.view.const.HEXA_SIDE;
    {
        const hex_pad_fraction = 0.04;
        pijersi.view.const.HEX_X_PAD = hex_pad_fraction*pijersi.view.const.HEXA_WIDTH;
        pijersi.view.const.HEX_Y_PAD = hex_pad_fraction*pijersi.view.const.HEXA_HEIGHT;
    }

    pijersi.view.const.HEXA_DELTA_Y = Math.sqrt(pijersi.view.const.HEXA_SIDE**2 - (pijersi.view.const.HEXA_WIDTH/2)**2);
    pijersi.view.const.HEXA_COS_SIDE_ANGLE = Math.cos(pijersi.view.const.HEXA_SIDE_ANGLE);
    pijersi.view.const.HEXA_SIN_SIDE_ANGLE = Math.sin(pijersi.view.const.HEXA_SIDE_ANGLE);

    pijersi.view.const.LABEL_BOX_WIDTH = 0.20*pijersi.view.const.HEXA_WIDTH;

    // Cube (square) geometrical data
    pijersi.view.const.BOARD_CUBE_VERTEX_COUNT = 4;
    pijersi.view.const.BOARD_CUBE_SIDE_ANGLE = Math.PI/2;

    // Origin of the orthonormal x-y frame and the oblic u-v frame
    pijersi.view.const.BOARD_ORIGIN = new pijersi.math.TinyVector(pijersi.view.const.BOARD_WIDTH/2, pijersi.view.const.BOARD_HEIGHT/2);

    // Unit vectors of the orthonormal x-y frame
    pijersi.view.const.BOARD_UNIT_X = new pijersi.math.TinyVector(1, 0);
    pijersi.view.const.BOARD_UNIT_Y = new pijersi.math.TinyVector(0, -1);

    // Unit vectors of the oblic u-v frame
    pijersi.view.const.BOARD_UNIT_U = pijersi.view.const.BOARD_UNIT_X;
    pijersi.view.const.BOARD_UNIT_V = ( pijersi.view.const.HEXA_COS_SIDE_ANGLE*pijersi.view.const.BOARD_UNIT_X 
                                      + pijersi.view.const.HEXA_SIN_SIDE_ANGLE*pijersi.view.const.BOARD_UNIT_Y );

    // Freeze the sub-module constants
    Object.freeze(pijersi.view.const);

    // Init the sub-module variables
    pijersi.view.menu_showed = false;
    pijersi.view.captures_showed = false;
    pijersi.view.labels_showed = false;

    pijersi.view.show_previous_showed = false;
    pijersi.view.show_next_showed = false;
    pijersi.view.swap_blacks_showed = false;
    pijersi.view.swap_whites_showed = false;

    pijersi.view.debug_showed = false;
    pijersi.view.show_debug(pijersi.view.debug_showed);

    pijersi.view.hexagon_boxes = undefined;
    pijersi.view.label_boxes = undefined;
    pijersi.view.capture_boxes = undefined;
    pijersi.view.hexagon_shapes = undefined;

    // Seal the sub-module
    Object.seal(pijersi.view);

    pijersi.view.const.BOARD.addEventListener( "mousemove" , pijersi.view.mouse_listner);

    pijersi.view.const.BODY.addEventListener( "keydown" , pijersi.view.key_listner);
};


pijersi.view.make_hexagon_selection = function(hexagon){

    const hexagon_center_x = pijersi.view.const.BOARD_ORIGIN.x + (hexagon.u + hexagon.v/2)*pijersi.view.const.HEXA_WIDTH;
    const hexagon_center_y = pijersi.view.const.BOARD_ORIGIN.y - hexagon.v*Math.sqrt(3)/2*pijersi.view.const.HEXA_WIDTH;

    const box_left = hexagon_center_x - pijersi.view.const.HEXA_WIDTH/2 + pijersi.view.const.HEX_X_PAD;
    const box_top = hexagon_center_y - pijersi.view.const.HEXA_HEIGHT/2 + pijersi.view.const.HEX_Y_PAD;

    const box_width = pijersi.view.const.HEXA_WIDTH - 2*pijersi.view.const.HEX_X_PAD;
    const box_height = pijersi.view.const.HEXA_HEIGHT - 2*pijersi.view.const.HEX_Y_PAD;

    const canvas = document.createElement("canvas");
    canvas.id = "pijersi-hexagon-shape-" + hexagon.name + "-id";

    canvas.style.left = box_left/pijersi.view.const.BOARD_WIDTH*100 + "%";
    canvas.style.top = box_top/pijersi.view.const.BOARD_HEIGHT*100 + "%";

    canvas.style.width = box_width/pijersi.view.const.BOARD_WIDTH*100 + "%";
    canvas.style.height = box_height/pijersi.view.const.BOARD_HEIGHT*100 + "%";
 
    canvas.className = pijersi.view.const.HEXA_SHAPE_STYLE;

    pijersi.view.const.BOARD.appendChild(canvas);

    {   // >> Here starts the intern world of the canvas

        // Redefine box origin
        const box_left = 0;
        const box_top = 0;

        // Redefine box size
        const box_width = canvas.width;
        const box_height = canvas.height;

        // Compute the 6 vertices of the hexagon shape

        const north_x = box_left + box_width/2;
        const north_y = box_top;

        const north_west_x = box_left;
        const north_west_y = box_top + box_height/4;

        const south_west_x = box_left;
        const south_west_y = box_top + box_height/4 + box_height/2;

        const south_x = box_left + box_width/2;
        const south_y = box_top + box_height;
    
        const south_east_x = box_left + box_width;
        const south_east_y = box_top + box_height/4 + box_height/2;
    
        const north_east_x = box_left + box_width;
        const north_east_y = box_top + box_height/4;

        // Draw the hexagon shape from its 6 vertices

        const ctx = canvas.getContext("2d");

        ctx.beginPath();
        ctx.moveTo(north_x, north_y);
        ctx.lineTo(north_west_x, north_west_y);
        ctx.lineTo(south_west_x, south_west_y);
        ctx.lineTo(south_x, south_y);
        ctx.lineTo(south_east_x, south_east_y);
        ctx.lineTo(north_east_x, north_east_y);
        ctx.lineTo(north_x, north_y);
        ctx.closePath();
        
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = "yellow";
        ctx.lineWidth = 5;
        ctx.strokeStyle = "blue";

        ctx.stroke();
        ctx.fill();
    }

    return canvas;
};


pijersi.view.make_hexagon_selections = function(hexagons){
    
    if ( pijersi.view.hexagon_shapes == undefined ) {

        let hexagon_shapes = [];

        for ( const hexagon of hexagons ) {
            hexagon_shapes.push(pijersi.view.make_hexagon_selection(hexagon));
        }
       
        pijersi.view.hexagon_shapes = hexagon_shapes;
    }
};


pijersi.view.make_capture_boxes = function(captures){

    if ( pijersi.view.capture_boxes === undefined ) {

        let capture_boxes = {};

        for ( const player in captures ) {
            capture_boxes[player] = {};

            for ( const cube_sort in captures[player] ) {
                capture_boxes[player][cube_sort] = [];
            
                const cube_count = captures[player][cube_sort].length;

                for ( let cube_index = 0 ; cube_index  < cube_count ; cube_index++ ) {
                    const element_id = "pijersi-view-capture-" + player + "-" + cube_sort + "-"+ (cube_index + 1) + "-id" ;
                    capture_boxes[player][cube_sort].push(document.getElementById(element_id));
                }
            }
        }

        pijersi.view.capture_boxes = capture_boxes;
    }
};


pijersi.view.update_captures = function(captures){
 
    for ( const player in captures ) {

        for ( const cube_sort in captures[player] ) {

            const cube_count = captures[player][cube_sort].length;

            for ( let cube_index = 0; cube_index  < cube_count ; cube_index++ ) {

                const capture_box = pijersi.view.capture_boxes[player][cube_sort][cube_index];

                if ( captures[player][cube_sort][cube_index] ) {

                    capture_box.classList.add(pijersi.view.const.SHOW_STYLE);

                } else {
                    capture_box.classList.remove(pijersi.view.const.SHOW_STYLE);
                }
            }
        }
    }
};


pijersi.view.make_hexagon_box = function(hexagon){

    const hexagon_center_x = pijersi.view.const.BOARD_ORIGIN.x + (hexagon.u + hexagon.v/2)*pijersi.view.const.HEXA_WIDTH;
    const hexagon_center_y = pijersi.view.const.BOARD_ORIGIN.y - hexagon.v*Math.sqrt(3)/2*pijersi.view.const.HEXA_WIDTH;

    const box_left = hexagon_center_x - pijersi.view.const.HEXA_WIDTH/2 + pijersi.view.const.HEX_X_PAD; 
    const box_top = hexagon_center_y - pijersi.view.const.HEXA_HEIGHT/2 + + pijersi.view.const.HEX_Y_PAD; 

    const box_width = pijersi.view.const.HEXA_WIDTH - 2*pijersi.view.const.HEX_X_PAD;
    const box_height = pijersi.view.const.HEXA_HEIGHT - 2*pijersi.view.const.HEX_Y_PAD;

    const hexagon_box = document.createElement("DIV");
    hexagon_box.id = "pijersi-hexagon-" + hexagon.name + "-id";

    hexagon_box.style.left = box_left/pijersi.view.const.BOARD_WIDTH*100 + "%";
    hexagon_box.style.top = box_top/pijersi.view.const.BOARD_HEIGHT*100 + "%";

    hexagon_box.style.width = box_width/pijersi.view.const.BOARD_WIDTH*100 + "%";
    hexagon_box.style.height = box_height/pijersi.view.const.BOARD_HEIGHT*100 + "%";
 
    hexagon_box.className = pijersi.view.const.HEXA_STYLE;

    pijersi.view.const.BOARD.appendChild(hexagon_box);

    return hexagon_box;
};


pijersi.view.make_hexagon_boxes = function(hexagons){
    
    if ( pijersi.view.hexagon_boxes == undefined ) {

        let hexagon_boxes = [];

        for ( const hexagon of hexagons ) {
            hexagon_boxes.push(pijersi.view.make_hexagon_box(hexagon));
        }
       
        pijersi.view.hexagon_boxes = hexagon_boxes;
    }
};


pijersi.view.make_label_boxes = function(hexagons){

    if ( pijersi.view.label_boxes === undefined ) {

        let label_boxes = [];

        const left_labels = [ "a1", "b1", "c1", "d1", "e1", "f1", "g1" ];
        const right_labels = [ "a6", "b7", "c6", "d7", "e6", "f7", "g6" ]

        for ( const hexagon of hexagons ) {

            if ( left_labels.includes(hexagon.name) || right_labels.includes(hexagon.name) ) {
                
                const text_node = document.createTextNode(hexagon.name);

                const paragraph_node = document.createElement("P");
                paragraph_node.className = pijersi.view.const.LABEL_TEXT_STYLE;
                paragraph_node.appendChild(text_node);

                const label_box = document.createElement("DIV");
                label_box.id = "pijersi-label-" + hexagon.name + "-id";
                label_box.className = pijersi.view.const.LABEL_BOX_STYLE;
                label_box.appendChild(paragraph_node);

                const hexagon_center_x = pijersi.view.const.BOARD_ORIGIN.x + (hexagon.u + hexagon.v/2)*pijersi.view.const.HEXA_WIDTH;
                const hexagon_center_y = pijersi.view.const.BOARD_ORIGIN.y - hexagon.v*Math.sqrt(3)/2*pijersi.view.const.HEXA_WIDTH;

                let box_left = undefined;

                 if ( left_labels.includes(hexagon.name) ) {
                    box_left = hexagon_center_x - pijersi.view.const.HEXA_WIDTH/2 - pijersi.view.const.LABEL_BOX_WIDTH; 

                 } else if ( right_labels.includes(hexagon.name) ) {
                    box_left = hexagon_center_x + pijersi.view.const.HEXA_WIDTH/2; 
                }
                
                const box_top = hexagon_center_y - pijersi.view.const.HEXA_HEIGHT/2 + pijersi.view.const.HEXA_SIDE/2; 

                const box_width = pijersi.view.const.LABEL_BOX_WIDTH;
                const box_height = pijersi.view.const.HEXA_SIDE;

                label_box.style.left = box_left/pijersi.view.const.BOARD_WIDTH*100 + "%";
                label_box.style.top = box_top/pijersi.view.const.BOARD_HEIGHT*100 + "%";

                label_box.style.width = box_width/pijersi.view.const.BOARD_WIDTH*100 + "%";
                label_box.style.height = box_height/pijersi.view.const.BOARD_HEIGHT*100 + "%";

                pijersi.view.const.BOARD.appendChild(label_box);

                label_boxes.push(label_box);
            }
        }

        pijersi.view.label_boxes = label_boxes;
    }
};


pijersi.view.mouse_listner = function(event){
    const mouse_position = pijersi.view.get_mouse_position(event);
    pijersi.view.write_mouse_position(Math.round(mouse_position.x), Math.round(mouse_position.y));
};


pijersi.view.get_mouse_position = function(event){

   // Return the mouse position in % relatively to the actual BOARD rectangle

   const board_rectangle = pijersi.view.const.BOARD.getBoundingClientRect();
 
    return { x: (event.clientX - board_rectangle.left)/board_rectangle.width*100,
             y: (event.clientY - board_rectangle.top)/board_rectangle.height*100 };
};


pijersi.view.write_mouse_position = function(x, y){
    const x_text = x.toString().padStart(3, "0");
    const y_text = y.toString().padStart(3, "0");
    
    pijersi.view.const.MOUSE_DEBUG.innerHTML = "(x,y) = (" + x_text + ", " + y_text + ")" ;
};


pijersi.view.key_listner = function(event){
    if ( event.key === 'd' ) {
        pijersi.view.toggle_debug();
    } 
};


pijersi.view.toggle_debug = function(){
    pijersi.view.debug_showed = ! pijersi.view.debug_showed;
    pijersi.view.show_debug(pijersi.view.debug_showed);
};


pijersi.view.show_debug = function(condition){

    if ( condition === true || condition === false ) {

        pijersi.view.debug_showed = condition;

        if ( pijersi.view.debug_showed ) {
            pijersi.view.const.MOUSE_DEBUG.classList.add(pijersi.view.const.SHOW_STYLE);
            pijersi.view.const.OTHER_DEBUG.classList.add(pijersi.view.const.SHOW_STYLE);

        } else {
            pijersi.view.const.MOUSE_DEBUG.classList.remove(pijersi.view.const.SHOW_STYLE);
            pijersi.view.const.OTHER_DEBUG.classList.remove(pijersi.view.const.SHOW_STYLE);
        }

    } else {
        pijersi.debug.log_error("unexpected 'condition' = " + condition);
    }
};


pijersi.view.click_element_by_id = function(element_id){

    const element = document.getElementById(element_id);
    element.click();
};


pijersi.view.show_menu = function(condition){

    if ( condition === true || condition === false ) {

        pijersi.view.menu_showed = condition;

        if ( pijersi.view.menu_showed ) {
            pijersi.view.const.MENU_ITEMS.classList.add(pijersi.view.const.SHOW_STYLE);

        } else {
            pijersi.view.const.MENU_ITEMS.classList.remove(pijersi.view.const.SHOW_STYLE);
        }

    } else {
        pijersi.debug.log_error("unexpected 'condition' = " + condition);
    }
};


pijersi.view.toggle_captures = function(condition){
    pijersi.view.captures_showed = ! pijersi.view.captures_showed;
    pijersi.view.show_captures(pijersi.view.captures_showed);
};


pijersi.view.toggle_labels = function(condition){
    pijersi.view.labels_showed = ! pijersi.view.labels_showed;
    pijersi.view.show_labels(pijersi.view.labels_showed);
};


pijersi.view.show_captures = function(condition){

    if ( condition === true || condition === false ) {

        pijersi.view.captures_showed = condition;

        if ( pijersi.view.captures_showed ) {
            pijersi.view.const.CAPTURES.classList.add(pijersi.view.const.SHOW_STYLE);

        } else {
            pijersi.view.const.CAPTURES.classList.remove(pijersi.view.const.SHOW_STYLE);
        }

    } else {
        pijersi.debug.log_error("unexpected 'condition' = " + condition);
    }

};


pijersi.view.show_labels = function(condition){

    if ( condition === true || condition === false ) {

        pijersi.view.labels_showed = condition;

        if ( pijersi.view.labels_showed ) {

            for ( const label_box of pijersi.view.label_boxes ) {
                for ( const paragraph_node of label_box.children ) {
                    paragraph_node.classList.add(pijersi.view.const.SHOW_STYLE);
                }
            }

        } else {

            for ( const label_box of pijersi.view.label_boxes ) {
                for ( const paragraph_node of label_box.children ) {
                    paragraph_node.classList.remove(pijersi.view.const.SHOW_STYLE);
                }
            }
        }

    } else {
        pijersi.debug.log_error("unexpected 'condition' = " + condition);
    }
};


pijersi.view.enable_capture_groups = function(condition){
    if ( condition === true || condition === false ) {

        if ( condition ) {
            pijersi.view.const.CAPTURE_GROUPS.forEach(function(capture_group){
                capture_group.classList.add(pijersi.view.const.CAPTURE_GROUP_EDIT_STYLE);
            });

        } else {
            pijersi.view.const.CAPTURE_GROUPS.forEach(function(capture_group){
                capture_group.classList.remove(pijersi.view.const.CAPTURE_GROUP_EDIT_STYLE);
            });
        }

    } else {
        pijersi.debug.log_error("unexpected 'condition' = " + condition);
    }
};


pijersi.view.set_title = function(title){
    pijersi.view.const.TITLE.innerHTML = title;
};


pijersi.view.set_legend = function(legend){
    pijersi.view.const.LEGEND.innerHTML = legend;
};


pijersi.view.set_credit = function(credit){
    pijersi.view.const.CREDIT.innerHTML = credit;
};


pijersi.view.enable_credit = function(condition){
    if ( condition === true || condition === false ) {

        if ( condition ) {
            pijersi.view.const.CREDIT.classList.add(pijersi.view.const.CREDIT_EDIT_STYLE);

        } else {
            pijersi.view.const.CREDIT.classList.remove(pijersi.view.const.CREDIT_EDIT_STYLE);
        }

    } else {
        pijersi.debug.log_error("unexpected 'condition' = " + condition);
    }
};


pijersi.view.show_black_turn = function(condition){
    if ( condition === true || condition === false ) {

        if ( condition ) {
            pijersi.view.const.BLACK_TURN.classList.add(pijersi.view.const.BLACK_TURN_ON_STYLE);

        } else {
            pijersi.view.const.BLACK_TURN.classList.remove(pijersi.view.const.BLACK_TURN_ON_STYLE);
        }

    } else {
        pijersi.debug.log_error("unexpected 'condition' = " + condition);
    }
};


pijersi.view.enable_black_turn = function(condition){
    if ( condition === true || condition === false ) {

        if ( condition ) {
            pijersi.view.const.BLACK_TURN.classList.add(pijersi.view.const.PLAYER_TURN_EDIT_STYLE);

        } else {
            pijersi.view.const.BLACK_TURN.classList.remove(pijersi.view.const.PLAYER_TURN_EDIT_STYLE);
        }

    } else {
        pijersi.debug.log_error("unexpected 'condition' = " + condition);
    }
};


pijersi.view.show_white_turn = function(condition){
    if ( condition === true || condition === false ) {

        if ( condition ) {
            pijersi.view.const.WHITE_TURN.classList.add(pijersi.view.const.WHITE_TURN_ON_STYLE);

        } else {
            pijersi.view.const.WHITE_TURN.classList.remove(pijersi.view.const.WHITE_TURN_ON_STYLE);
        }

    } else {
        pijersi.debug.log_error("unexpected 'condition' = " + condition);
    }
};


pijersi.view.enable_white_turn = function(condition){
    if ( condition === true || condition === false ) {

        if ( condition ) {
            pijersi.view.const.WHITE_TURN.classList.add(pijersi.view.const.PLAYER_TURN_EDIT_STYLE);

        } else {
            pijersi.view.const.WHITE_TURN.classList.remove(pijersi.view.const.PLAYER_TURN_EDIT_STYLE);
        }

    } else {
        pijersi.debug.log_error("unexpected 'condition' = " + condition);
    }
};


pijersi.view.show_next_turn = function(condition){
    if ( condition === true || condition === false ) {

        pijersi.view.show_next_showed = condition;

        if ( pijersi.view.show_next_showed ) {
            pijersi.view.const.RIGHT_MULTI_FUNC.classList.add(pijersi.view.const.SHOW_NEXT_ON_STYLE);

        } else {
            pijersi.view.const.RIGHT_MULTI_FUNC.classList.remove(pijersi.view.const.SHOW_NEXT_ON_STYLE);
        }

    } else {
        pijersi.debug.log_error("unexpected 'condition' = " + condition);
    }
};


pijersi.view.show_previous_turn = function(condition){
    if ( condition === true || condition === false ) {

        pijersi.view.show_previous_showed = condition;

        if ( pijersi.view.show_previous_showed ) {
            pijersi.view.const.LEFT_MULTI_FUNC.classList.add(pijersi.view.const.SHOW_PREVIOUS_ON_STYLE);

        } else {
            pijersi.view.const.LEFT_MULTI_FUNC.classList.remove(pijersi.view.const.SHOW_PREVIOUS_ON_STYLE);
        }

    } else {
        pijersi.debug.log_error("unexpected 'condition' = " + condition);
    }
};


pijersi.view.show_white_swap = function(condition){
    if ( condition === true || condition === false ) {

        pijersi.view.swap_whites_showed = condition;

        if ( pijersi.view.swap_whites_showed ) {
            pijersi.view.const.RIGHT_MULTI_FUNC.classList.add(pijersi.view.const.SWAP_WHITES_ON_STYLE);

        } else {
            pijersi.view.const.RIGHT_MULTI_FUNC.classList.remove(pijersi.view.const.SWAP_WHITES_ON_STYLE);
        }

    } else {
        pijersi.debug.log_error("unexpected 'condition' = " + condition);
    }
};


pijersi.view.show_black_swap = function(condition){
    if ( condition === true || condition === false ) {

        pijersi.view.swap_blacks_showed = condition;

        if ( pijersi.view.swap_blacks_showed ) {
            pijersi.view.const.LEFT_MULTI_FUNC.classList.add(pijersi.view.const.SWAP_BLACKS_ON_STYLE);

        } else {
            pijersi.view.const.LEFT_MULTI_FUNC.classList.remove(pijersi.view.const.SWAP_BLACKS_ON_STYLE);
        }

    } else {
        pijersi.debug.log_error("unexpected 'condition' = " + condition);
    }
};


///////////////////////////////////////////////////////////////////////////////
