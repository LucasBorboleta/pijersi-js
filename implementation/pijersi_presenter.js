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
};


pijersi.presenter.update_all = function(){
    
    pijersi.presenter.update_mode();

    pijersi.presenter.update_title();
    pijersi.presenter.update_legend();
    pijersi.presenter.update_credit();
    pijersi.presenter.update_player();
};


pijersi.presenter.update_mode = function(){
 
    const mode = pijersi.model.get_mode();

    if ( mode === pijersi.model.const.MODE_RUNNING ) {
        pijersi.view.show_next_turn(false);
        pijersi.view.show_previous_turn(false);
        pijersi.view.enable_white_turn(false);
        pijersi.view.enable_black_turn(false);
        pijersi.view.enable_credit(false);

    } else if ( mode === pijersi.model.const.MODE_REVIEWING ) {
        pijersi.view.show_next_turn(true);
        pijersi.view.show_previous_turn(true);		
        pijersi.view.enable_white_turn(false);
        pijersi.view.enable_black_turn(false);
        pijersi.view.enable_credit(false);

    } else if ( mode === pijersi.model.const.MODE_EDITING ) {
        pijersi.view.show_next_turn(false);
        pijersi.view.show_previous_turn(false);
        pijersi.view.enable_white_turn(true);
        pijersi.view.enable_black_turn(true);
        pijersi.view.enable_credit(true);
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


pijersi.presenter.set_mode = function(mode){
    pijersi.model.set_mode(mode);
    pijersi.presenter.update_mode();
};

pijersi.presenter.increment_credit = function(){
    pijersi.model.increment_credit();
    pijersi.presenter.update_credit()					
};


pijersi.presenter.decrement_credit = function(){
    pijersi.model.decrement_credit();
    pijersi.presenter.update_credit()					
};


pijersi.presenter.reset_credit = function(){
    pijersi.model.reset_credit();
    pijersi.presenter.update_credit()					
};


pijersi.presenter.new_game = function(){
    pijersi.view.show_menu(false);

    pijersi.model.new_game();
    pijersi.presenter.update_all();
};
        

pijersi.presenter.stop_game = function(){
    pijersi.view.show_menu(false);

    pijersi.presenter.set_mode(pijersi.model.const.MODE_REVIEWING);
};
        

pijersi.presenter.resume_game = function(){
    pijersi.view.show_menu(false);

    pijersi.model.turns = pijersi.model.turns.slice(0, pijersi.model.current_turn + 1)

    pijersi.presenter.update_legend();
    pijersi.presenter.update_credit();

    if ( pijersi.model.credit !== 0 ) {
        pijersi.presenter.set_mode(pijersi.model.const.MODE_RUNNING);
    }
};
        

pijersi.presenter.edit_game = function(){
    pijersi.view.show_menu(false);
    
    pijersi.presenter.set_mode(pijersi.model.const.MODE_EDITING);
};


pijersi.presenter.show_captures = function(){
    pijersi.view.show_menu(false);
};


pijersi.presenter.show_labels = function(){
    pijersi.view.show_menu(false);
};


pijersi.presenter.toggle_player_turn = function(){
    if ( pijersi.model.get_mode() !== pijersi.model.const.MODE_EDITING ) return;
    pijersi.model.change_player();
    pijersi.presenter.update_all();
};


pijersi.presenter.show_next_turn = function(){
    if ( pijersi.model.get_mode() !== pijersi.model.const.MODE_REVIEWING ) return;
    
    if ( pijersi.model.current_turn + 1 < pijersi.model.turns.length ) {
        pijersi.model.current_turn += 1;

        pijersi.presenter.update_legend();
        pijersi.presenter.update_credit();
    }
};


pijersi.presenter.show_previous_turn = function(){
    if ( pijersi.model.get_mode() !== pijersi.model.const.MODE_REVIEWING ) return;
    
    if ( pijersi.model.current_turn - 1 >= 0 ) {
        pijersi.model.current_turn -= 1;

        pijersi.presenter.update_legend();
        pijersi.presenter.update_credit();
    }
};


pijersi.presenter.simulate_play = function(){
    if ( pijersi.view.menu_showed ) return;
    if ( pijersi.model.get_mode() !== pijersi.model.const.MODE_RUNNING ) return;

    pijersi.model.new_turn();
    pijersi.presenter.update_all();
};
///////////////////////////////////////////////////////////////////////////////
