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
pijersi.presenter = { };
pijersi.presenter.__init_called = false;

pijersi.presenter.__init = function(){

    if ( pijersi.presenter.__init_called ) return;
    pijersi.presenter.__init_called = true;

    // Init the required sub-modules
    pijersi.debug.__init();
    pijersi.model.__init();
    pijersi.view.__init();

    // Init the sub-module constants: None
    // Init the sub-module variables: None

    // Seal the sub-module
    Object.seal(pijersi.presenter);

    pijersi.model.make_all_hexagons();
    pijersi.model.make_all_hexagons_states(pijersi.model.hexagons);
    pijersi.model.make_all_captures();

    pijersi.view.make_hexagon_infos(pijersi.model.hexagons);
    pijersi.view.make_hexagon_boxes(pijersi.model.hexagons);
    pijersi.view.make_label_boxes(pijersi.model.hexagons);
    pijersi.view.make_capture_boxes(pijersi.model.captures);

    pijersi.view.make_hexagon_selections(pijersi.model.hexagons, pijersi.view.const.HEXA_SELECTION_1);
    pijersi.view.make_hexagon_selections(pijersi.model.hexagons, pijersi.view.const.HEXA_SELECTION_2);
    pijersi.view.make_hexagon_selections(pijersi.model.hexagons, pijersi.view.const.HEXA_SELECTION_3);

    pijersi.view.make_hexagon_markers(pijersi.model.hexagons, pijersi.view.const.HEXA_MARKER_1, pijersi.model.const.PLAYER_WHITE);
    pijersi.view.make_hexagon_markers(pijersi.model.hexagons, pijersi.view.const.HEXA_MARKER_2, pijersi.model.const.PLAYER_WHITE);

    pijersi.view.make_hexagon_markers(pijersi.model.hexagons, pijersi.view.const.HEXA_MARKER_1, pijersi.model.const.PLAYER_BLACK);
    pijersi.view.make_hexagon_markers(pijersi.model.hexagons, pijersi.view.const.HEXA_MARKER_2, pijersi.model.const.PLAYER_BLACK);

    pijersi.view.make_top_cubes(pijersi.model.hexagons);
    //pijersi.view.make_middle_cubes(pijersi.model.hexagons);
    pijersi.view.make_bottom_cubes(pijersi.model.hexagons);

  
    if ( ! pijersi.view.labels_showed ) {
        // >> the 'labels' must be showed, but also the associated checkbox must be 'checked' !
        pijersi.view.click_element_by_id('pijersi-view-show-labels-id');
    }

    if ( ! pijersi.view.captures_showed ) {
        // >> the 'captures' must be showed, but also the associated checkbox must be 'checked' !
       pijersi.view.click_element_by_id('pijersi-view-show-captures-id');
    }

    pijersi.presenter.new_game();

    pijersi.presenter.testit();
};


pijersi.presenter.testit = function(){
    console.log("testit: hello");

    pijersi.model.captures[pijersi.model.const.PLAYER_WHITE][pijersi.model.const.CUBE_ROCK] = [false, true, false, false];
    pijersi.model.captures[pijersi.model.const.PLAYER_WHITE][pijersi.model.const.CUBE_PAPER] = [true, true, true, false];
    pijersi.model.captures[pijersi.model.const.PLAYER_WHITE][pijersi.model.const.CUBE_SCISSORS] = [true, true, false, false];
    pijersi.model.captures[pijersi.model.const.PLAYER_WHITE][pijersi.model.const.CUBE_WISE] = [true, true];
     
    pijersi.model.captures[pijersi.model.const.PLAYER_BLACK][pijersi.model.const.CUBE_ROCK] = [true, false, false, true];
    pijersi.model.captures[pijersi.model.const.PLAYER_BLACK][pijersi.model.const.CUBE_PAPER] = [false, false, false, false];
    pijersi.model.captures[pijersi.model.const.PLAYER_BLACK][pijersi.model.const.CUBE_SCISSORS] = [true, true, false, false];
    pijersi.model.captures[pijersi.model.const.PLAYER_BLACK][pijersi.model.const.CUBE_WISE] = [true, false];

    pijersi.presenter.update_all();

    pijersi.view.show_selection(true, pijersi.view.const.HEXA_SELECTION_1, pijersi.model.get_hexagon_by_name("d4"));
    pijersi.view.show_selection(true, pijersi.view.const.HEXA_SELECTION_2, pijersi.model.get_hexagon_by_name("d3"));

    pijersi.view.show_selection(true, pijersi.view.const.HEXA_SELECTION_1, pijersi.model.get_hexagon_by_name("d2"));
    pijersi.view.show_selection(false, pijersi.view.const.HEXA_SELECTION_1, pijersi.model.get_hexagon_by_name("d2"));

    pijersi.view.show_selection(false, pijersi.view.const.HEXA_SELECTION_1, pijersi.model.get_hexagon_by_name("d1"));
    pijersi.view.show_selection(true, pijersi.view.const.HEXA_SELECTION_1, pijersi.model.get_hexagon_by_name("d1"));

    pijersi.view.show_selection(true, pijersi.view.const.HEXA_SELECTION_1, pijersi.model.get_hexagon_by_name("a1"));
    pijersi.view.show_selection(true, pijersi.view.const.HEXA_SELECTION_3, pijersi.model.get_hexagon_by_name("d6"));
    pijersi.view.show_selection(true, pijersi.view.const.HEXA_SELECTION_3, pijersi.model.get_hexagon_by_name("g2"));

    pijersi.view.show_marker(true, pijersi.view.const.HEXA_MARKER_1, pijersi.model.const.PLAYER_WHITE, pijersi.model.get_hexagon_by_name("a1"));
    pijersi.view.show_marker(true, pijersi.view.const.HEXA_MARKER_1, pijersi.model.const.PLAYER_BLACK, pijersi.model.get_hexagon_by_name("a2"));
    pijersi.view.show_marker(true, pijersi.view.const.HEXA_MARKER_2, pijersi.model.const.PLAYER_WHITE, pijersi.model.get_hexagon_by_name("d4"));
    pijersi.view.show_marker(true, pijersi.view.const.HEXA_MARKER_2, pijersi.model.const.PLAYER_BLACK, pijersi.model.get_hexagon_by_name("d2"));
 
    pijersi.view.show_marker(true, pijersi.view.const.HEXA_MARKER_1, pijersi.model.const.PLAYER_BLACK, pijersi.model.get_hexagon_by_name("d3"));

    pijersi.view.show_marker(true, pijersi.view.const.HEXA_MARKER_2, pijersi.model.const.PLAYER_BLACK, pijersi.model.get_hexagon_by_name("a6"));
    pijersi.view.show_marker(true, pijersi.view.const.HEXA_MARKER_2, pijersi.model.const.PLAYER_BLACK, pijersi.model.get_hexagon_by_name("f1"));
    pijersi.view.show_marker(true, pijersi.view.const.HEXA_MARKER_1, pijersi.model.const.PLAYER_WHITE, pijersi.model.get_hexagon_by_name("g6"));
    pijersi.view.show_marker(true, pijersi.view.const.HEXA_MARKER_1, pijersi.model.const.PLAYER_BLACK, pijersi.model.get_hexagon_by_name("f7"));

    console.log("testit: bye");
};


pijersi.presenter.update_all = function(){

    pijersi.presenter.update_mode();

    pijersi.presenter.update_title();
    pijersi.presenter.update_legend();
    pijersi.presenter.update_credit();
    pijersi.presenter.update_player();
    pijersi.presenter.update_captures();
};


pijersi.presenter.update_mode = function(){

    const mode = pijersi.model.get_mode();

    if ( mode === pijersi.model.const.MODE_RUN ) {
        pijersi.view.show_next_turn(false);
        pijersi.view.show_previous_turn(false);

        pijersi.view.enable_white_turn(false);
        pijersi.view.enable_black_turn(false);

        pijersi.view.enable_credit(false);

        pijersi.view.show_white_swap(false);
        pijersi.view.show_black_swap(false);
        
        pijersi.view.enable_capture_groups(false);

    } else if ( mode === pijersi.model.const.MODE_REVIEW ) {
        pijersi.view.show_next_turn(true);
        pijersi.view.show_previous_turn(true);	

        pijersi.view.enable_white_turn(false);
        pijersi.view.enable_black_turn(false);

        pijersi.view.enable_credit(false);

        pijersi.view.show_white_swap(false);
        pijersi.view.show_black_swap(false);

        pijersi.view.enable_capture_groups(false);

    } else if ( mode === pijersi.model.const.MODE_EDIT ) {
        pijersi.view.show_next_turn(false);
        pijersi.view.show_previous_turn(false);

        pijersi.view.enable_white_turn(true);
        pijersi.view.enable_black_turn(true);

        pijersi.view.enable_credit(true);

        pijersi.view.show_white_swap(true);
        pijersi.view.show_black_swap(true);

        pijersi.view.enable_capture_groups(true);
    }

};


pijersi.presenter.update_title = function(){
    const mode = pijersi.model.get_mode();
    const title = "Pijersi [" + mode + "]";
    pijersi.view.set_title(title);
};


pijersi.presenter.update_legend = function(){
    const legend = pijersi.model.get_legend();
    pijersi.view.set_legend(legend);
};


pijersi.presenter.update_credit = function(){
    const credit = pijersi.model.get_credit();
    const credit_text = credit.toString().padStart(2, '0');
    pijersi.view.set_credit(credit_text);
};


pijersi.presenter.update_player = function(){
    const player = pijersi.model.get_player();

    if ( player === pijersi.model.const.PLAYER_WHITE ) {
        pijersi.view.show_white_turn(true);
        pijersi.view.show_black_turn(false);

    } else if ( player === pijersi.model.const.PLAYER_BLACK ) {
        pijersi.view.show_black_turn(true);
        pijersi.view.show_white_turn(false);
    }
};


pijersi.presenter.toggle_menu = function(){
    pijersi.view.menu_showed = ! pijersi.view.menu_showed;
    pijersi.view.show_menu(pijersi.view.menu_showed);
};


pijersi.presenter.update_captures = function(){
    pijersi.view.update_captures(pijersi.model.captures);
};


pijersi.presenter.toggle_captures = function(){
    pijersi.view.show_menu(false);
    pijersi.view.toggle_captures();
};


pijersi.presenter.toggle_labels = function(){
    pijersi.view.show_menu(false);
    pijersi.view.toggle_labels();

};


pijersi.presenter.new_game = function(){
    pijersi.view.show_menu(false);

    pijersi.model.new_game();
    pijersi.presenter.update_all();
};


pijersi.presenter.play_game = function(){
    if ( pijersi.view.menu_showed ) return;

    if ( pijersi.model.get_mode() !== pijersi.model.const.MODE_RUN ) return;

    pijersi.model.new_turn();
    pijersi.presenter.update_all();
};


pijersi.presenter.stop_review_game = function(){
    pijersi.view.show_menu(false);

    pijersi.model.stop_review_game();
    pijersi.presenter.update_all();
};


pijersi.presenter.show_next_turn = function(){
    if ( pijersi.view.menu_showed ) return;

    if ( pijersi.model.get_mode() !== pijersi.model.const.MODE_REVIEW ) return;

    pijersi.model.goto_next_turn();
    pijersi.presenter.update_all();
};


pijersi.presenter.show_previous_turn = function(){
    if ( pijersi.view.menu_showed ) return;

    if ( pijersi.model.get_mode() !== pijersi.model.const.MODE_REVIEW ) return;

    pijersi.model.goto_previous_turn();
    pijersi.presenter.update_all();
};


pijersi.presenter.resume_game = function(){
    pijersi.view.show_menu(false);

    pijersi.model.resume_game();
    pijersi.presenter.update_all();
};


pijersi.presenter.edit_game = function(){
    pijersi.view.show_menu(false);

    pijersi.model.edit_game();
    pijersi.presenter.update_all();
};


pijersi.presenter.edit_credit = function(){
    if ( pijersi.view.menu_showed ) return;

    if ( pijersi.model.get_mode() !== pijersi.model.const.MODE_EDIT ) return;

    pijersi.model.edit_credit();
    pijersi.presenter.update_all();
};


pijersi.presenter.edit_player_turn = function(){
    if ( pijersi.view.menu_showed ) return;

    if ( pijersi.model.get_mode() !== pijersi.model.const.MODE_EDIT ) return;

    pijersi.model.edit_player_turn();
    pijersi.presenter.update_all();
};


pijersi.presenter.swap_whites = function(){
    if ( pijersi.view.menu_showed ) return;

    if ( pijersi.model.get_mode() !== pijersi.model.const.MODE_EDIT ) return;

    console.log("pijersi.presenter.swap_whites: NOT-IMPLEMENTED");
};


pijersi.presenter.swap_blacks = function(){
    if ( pijersi.view.menu_showed ) return;

    if ( pijersi.model.get_mode() !== pijersi.model.const.MODE_EDIT ) return;

    console.log("pijersi.presenter.swap_blacks: NOT-IMPLEMENTED");
};


pijersi.presenter.click_right_multi_func = function(){

    if ( pijersi.view.show_next_showed ) {
        pijersi.presenter.show_next_turn();

    } else if ( pijersi.view.swap_whites_showed ) {
        pijersi.presenter.swap_whites();

    } else {
        return;
    }
};


pijersi.presenter.click_left_multi_func = function(){

    if ( pijersi.view.show_previous_showed ) {
        pijersi.presenter.show_previous_turn();

    } else if ( pijersi.view.swap_blacks_showed ) {
        pijersi.presenter.swap_blacks();

    } else {
        return;
    }
};
///////////////////////////////////////////////////////////////////////////////
