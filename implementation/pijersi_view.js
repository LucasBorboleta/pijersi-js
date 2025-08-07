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

    // Init the sub-module constants

    pijersi.view.const = {};

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


    pijersi.view.const.SHOW_STYLE = "pijersi-view-show-style";

    pijersi.view.const.PLAYER_TURN_EDIT_STYLE = "pijersi-view-player-turn-edit-style";
    pijersi.view.const.CREDIT_EDIT_STYLE = "pijersi-view-credit-edit-style";

    pijersi.view.const.BLACK_TURN_ON_STYLE = "pijersi-view-black-turn-on-style";
    pijersi.view.const.WHITE_TURN_ON_STYLE = "pijersi-view-white-turn-on-style";

    pijersi.view.const.SHOW_PREVIOUS_ON_STYLE = "pijersi-view-show-previous-on-style";
    pijersi.view.const.SHOW_NEXT_ON_STYLE = "pijersi-view-show-next-on-style";

    pijersi.view.const.SWAP_BLACKS_ON_STYLE = "pijersi-view-swap-blacks-on-syle";
    pijersi.view.const.SWAP_WHITES_ON_STYLE = "pijersi-view-swap-whites-on-syle";

    // Freeze the sub-module constants
    Object.freeze(pijersi.view.const);

    // Init the sub-module variables
    pijersi.view.menu_showed = false;
    pijersi.view.captures_showed = false;

    pijersi.view.show_previous_showed = false;
    pijersi.view.show_next_showed = false;
    pijersi.view.swap_blacks_showed = false;
    pijersi.view.swap_whites_showed = false;

    // Seal the sub-module
    Object.seal(pijersi.view);
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
