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

    pijersi.view.const.PLAYER_TURN_EDIT_STYLE = "pijersi-view-player-turn-edit-style";
    pijersi.view.const.CREDIT_EDIT_STYLE = "pijersi-view-credit-edit-style";

    pijersi.view.const.BLACK_TURN_ON_STYLE = "pijersi-view-black-turn-on-style";
    pijersi.view.const.WHITE_TURN_ON_STYLE = "pijersi-view-white-turn-on-style";

    pijersi.view.const.SHOW_PREVIOUS_ON_STYLE = "pijersi-view-show-previous-on-style";
    pijersi.view.const.SHOW_NEXT_ON_STYLE = "pijersi-view-show-next-on-style";

    pijersi.view.const.SWAP_BLACKS_ON_STYLE = "pijersi-view-swap-blacks-on-syle";
    pijersi.view.const.SWAP_WHITES_ON_STYLE = "pijersi-view-swap-whites-on-syle";

    pijersi.view.const.CAPTURE_GROUP_EDIT_STYLE = "pijersi-view-capture-group-style";


    // >> All dimensions of board, hexagons and cubes are expressed in pixels
    // >> As resize of window could change such dimensions, 
    // >> those memorized dimensions should be understood as initial dimensions
    // >> and should be applied in % of the board dimensions when constructing DIV, etc.

    // Board x-y dimensions in hexagon width units
    // >> This complex formula is related to the construction of the background picture for the board
    pijersi.view.const.BOARD_NX = 8;
    pijersi.view.const.BOARD_NY = (4 + 5/2)*2/Math.sqrt(3);

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

    pijersi.view.show_previous_showed = false;
    pijersi.view.show_next_showed = false;
    pijersi.view.swap_blacks_showed = false;
    pijersi.view.swap_whites_showed = false;

    pijersi.view.debug_showed = false;
    pijersi.view.show_debug(pijersi.view.debug_showed);

    pijersi.view.hexagon_divs = pijersi.view.make_all_hexagon_div(pijersi.model.hexagons);

    // Seal the sub-module
    Object.seal(pijersi.view);

    pijersi.view.const.BOARD.addEventListener( "mousemove" , pijersi.view.mouse_listner);

    pijersi.view.const.BODY.addEventListener( "keydown" , pijersi.view.key_listner);

    pijersi.view.testit();
};


pijersi.view.testit = function(){

    const board_rectangle = pijersi.view.const.BOARD.getBoundingClientRect();
    console.log("board_rectangle = " + board_rectangle);

    console.log("board_rectangle.left = " + board_rectangle.left);
    console.log("board_rectangle.top = " + board_rectangle.top);
    console.log("board_rectangle.right = " + board_rectangle.right);
    console.log("board_rectangle.bottom = " + board_rectangle.bottom);
    console.log("board_rectangle.x = " + board_rectangle.x);
    console.log("board_rectangle.y = " + board_rectangle.y);
    console.log("board_rectangle.width = " + board_rectangle.width);
    console.log("board_rectangle.height = " + board_rectangle.height);

    let aaa = new pijersi.math.TinyVector(1, 2);
    console.log("aaa = " + aaa.toString());
};


pijersi.view.make_hexagon_div = function(hexagon){

    const hexagon_div = document.createElement("DIV");
    hexagon_div.id = "pijersi-hexagon-" + hexagon.name + "-id";

    const x_hexagon = pijersi.view.const.BOARD_ORIGIN.x + (hexagon.u + hexagon.v/2)*pijersi.view.const.HEXA_WIDTH;
    const y_hexagon = pijersi.view.const.BOARD_ORIGIN.y - hexagon.v*Math.sqrt(3)/2*pijersi.view.const.HEXA_WIDTH;

    const x_hexagon_div = x_hexagon - pijersi.view.const.HEXA_WIDTH/2 ; // hexagon left before padding
    const y_hexagon_div = y_hexagon - pijersi.view.const.HEXA_HEIGHT/2; // hexagon top before padding

    hexagon_div.style.left = (x_hexagon_div + pijersi.view.const.HEX_X_PAD)/pijersi.view.const.BOARD_WIDTH*100 + "%";
    hexagon_div.style.top = (y_hexagon_div + pijersi.view.const.HEX_Y_PAD)/pijersi.view.const.BOARD_HEIGHT*100 + "%";

    hexagon_div.style.width = (pijersi.view.const.HEXA_WIDTH - 2*pijersi.view.const.HEX_X_PAD)/pijersi.view.const.BOARD_WIDTH*100 + "%";
    hexagon_div.style.height = (pijersi.view.const.HEXA_HEIGHT - 2*pijersi.view.const.HEX_Y_PAD)/pijersi.view.const.BOARD_HEIGHT*100 + "%";
 
    hexagon_div.className = "pijersi-view-hexagon-style";

    pijersi.view.const.BOARD.appendChild(hexagon_div);

    return hexagon_div;
};


pijersi.view.make_all_hexagon_div = function(hexagons){

    let hexagon_divs = [];

    for ( const hexagon of hexagons ) {
        hexagon_divs.push(pijersi.view.make_hexagon_div(hexagon));
    }

    return hexagon_divs;
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


pijersi.view.toggle_checkbox = function(checkbox_id){

    const checkbox = document.getElementById(checkbox_id);
    checkbox.click();
};


pijersi.view.toggle_menu = function(){
    pijersi.view.menu_showed = ! pijersi.view.menu_showed;
    pijersi.view.show_menu(pijersi.view.menu_showed);
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


pijersi.view.click_right_multi_func = function(){

    if ( pijersi.view.show_next_showed ) {
        pijersi.presenter.show_next_turn();

    } else if ( pijersi.view.swap_whites_showed ) {
        pijersi.presenter.swap_whites();

    } else {
        return;
    }
};


pijersi.view.click_left_multi_func = function(){

    if ( pijersi.view.show_previous_showed ) {
        pijersi.presenter.show_previous_turn();

    } else if ( pijersi.view.swap_blacks_showed ) {
        pijersi.presenter.swap_blacks();

    } else {
        return;
    }
};
///////////////////////////////////////////////////////////////////////////////
