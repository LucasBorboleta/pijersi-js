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

    // Init required packages
    pijersi.model.__init();
    pijersi.view.__init();

    // Init constants : none
 
    // Init variables : none

    // Seal the module
    Object.seal(pijersi.presenter);
};


pijersi.presenter.init = function(){
    pijersi.presenter.new_game();
};


pijersi.presenter.set_mode = function(mode){
    if ( mode === pijersi.model.const.MODE_RUNNING || mode === pijersi.model.const.MODE_REVIEWING || mode === pijersi.model.const.MODE_EDITING ) {
        
        pijersi.model.mode = mode;
        pijersi.presenter.update_title();

        if ( mode === pijersi.model.const.MODE_EDITING ) {
            pijersi.view.const.WHITE_TURN.classList.add(pijersi.view.const.TURN_EDIT_STYLE);
            pijersi.view.const.BLACK_TURN.classList.add(pijersi.view.const.TURN_EDIT_STYLE);
            pijersi.view.const.CREDIT.classList.add(pijersi.view.const.CREDIT_EDIT_STYLE);
            pijersi.view.const.NEXT_TURN.classList.remove(pijersi.view.const.SHOW_STYLE);
            pijersi.view.const.PREVIOUS_TURN.classList.remove(pijersi.view.const.SHOW_STYLE);

        } else if ( mode === pijersi.model.const.MODE_REVIEWING ) {
            pijersi.view.const.NEXT_TURN.classList.add(pijersi.view.const.SHOW_STYLE);
            pijersi.view.const.PREVIOUS_TURN.classList.add(pijersi.view.const.SHOW_STYLE);		
            pijersi.view.const.WHITE_TURN.classList.remove(pijersi.view.const.TURN_EDIT_STYLE);
            pijersi.view.const.BLACK_TURN.classList.remove(pijersi.view.const.TURN_EDIT_STYLE);
            pijersi.view.const.CREDIT.classList.remove(pijersi.view.const.CREDIT_EDIT_STYLE);

        } else {
            pijersi.view.const.WHITE_TURN.classList.remove(pijersi.view.const.TURN_EDIT_STYLE);
            pijersi.view.const.BLACK_TURN.classList.remove(pijersi.view.const.TURN_EDIT_STYLE);
            pijersi.view.const.CREDIT.classList.remove(pijersi.view.const.CREDIT_EDIT_STYLE);
            pijersi.view.const.NEXT_TURN.classList.remove(pijersi.view.const.SHOW_STYLE);
            pijersi.view.const.PREVIOUS_TURN.classList.remove(pijersi.view.const.SHOW_STYLE);
        }
    }
};


pijersi.presenter.update_title = function(){
    const mode = pijersi.model.mode;
    pijersi.view.const.TITLE.innerHTML = "Pijersi [" + mode + "]";
};


pijersi.presenter.update_legend = function(){
    const legend = pijersi.model.turns[pijersi.model.current_turn].legend;
    pijersi.view.const.LEGEND.innerHTML = legend;
};


pijersi.presenter.update_credit = function(){
    const credit = pijersi.model.turns[pijersi.model.current_turn].credit;
    pijersi.view.const.CREDIT.innerHTML = credit.toString().padStart(2, '0');
};


pijersi.presenter.increment_credit = function(){
    pijersi.model.credit = pijersi.model.credit + 1;
    if ( pijersi.model.credit > pijersi.model.const.CREDIT_MAX ) pijersi.model.credit = 0;
    pijersi.model.turns[pijersi.model.current_turn].credit = pijersi.model.credit;
    pijersi.presenter.update_credit()					
};


pijersi.presenter.decrement_credit = function(){
    pijersi.model.credit = pijersi.model.credit - 1;
    if ( pijersi.model.credit < 0 ) pijersi.model.credit = 0;
    pijersi.model.turns[pijersi.model.current_turn].credit = pijersi.model.credit;
    pijersi.presenter.update_credit()					
};


pijersi.presenter.reset_credit = function(){
    pijersi.model.credit = pijersi.model.const.CREDIT_MAX;
    pijersi.model.turns[pijersi.model.current_turn].credit = pijersi.model.credit;
    pijersi.presenter.update_credit()					
};


pijersi.presenter.set_player = function(player){
    if ( player === pijersi.model.const.PLAYER_WHITE || player === pijersi.model.const.PLAYER_BLACK ) {
        pijersi.model.player = player
    }

    if ( pijersi.model.player === pijersi.model.const.PLAYER_WHITE ) {
        pijersi.view.const.BLACK_TURN.classList.remove(pijersi.view.const.BLACK_TURN_ON_STYLE);
        pijersi.view.const.WHITE_TURN.classList.add(pijersi.view.const.WHITE_TURN_ON_STYLE);

    } else if ( pijersi.model.player === pijersi.model.const.PLAYER_BLACK ) {
        pijersi.view.const.WHITE_TURN.classList.remove(pijersi.view.const.WHITE_TURN_ON_STYLE);
        pijersi.view.const.BLACK_TURN.classList.add(pijersi.view.const.BLACK_TURN_ON_STYLE);
    }
};


pijersi.presenter.change_player = function(){
    if ( pijersi.model.player === pijersi.model.const.PLAYER_WHITE ) {
        pijersi.presenter.set_player(pijersi.model.const.PLAYER_BLACK);

    } else if ( pijersi.model.player === pijersi.model.const.PLAYER_BLACK ) {
        pijersi.presenter.set_player(pijersi.model.const.PLAYER_WHITE);
    }
};


pijersi.presenter.toggle_menu = function(){
    pijersi.view.menu_showed = ! pijersi.view.menu_showed;
    pijersi.presenter.show_menu(pijersi.view.menu_showed);
};


pijersi.presenter.show_menu = function(condition){

    if ( condition !== true && condition !== false ) return ;

    pijersi.view.menu_showed = condition;

    if ( pijersi.view.menu_showed ) {
        pijersi.view.const.MENU_ITEMS.classList.add(pijersi.view.const.SHOW_STYLE);

    } else {
        pijersi.view.const.MENU_ITEMS.classList.remove(pijersi.view.const.SHOW_STYLE);
    }
};


pijersi.presenter.new_game = function(){
    pijersi.presenter.show_menu(false);

    pijersi.model.reset_turns();
    pijersi.presenter.reset_credit();

    pijersi.presenter.set_mode(pijersi.model.const.MODE_RUNNING);
    pijersi.presenter.set_player(pijersi.model.const.PLAYER_WHITE);

    pijersi.presenter.update_legend();
    pijersi.presenter.update_credit();
};
        

pijersi.presenter.stop_game = function(){
    pijersi.presenter.show_menu(false);

    pijersi.presenter.set_mode(pijersi.model.const.MODE_REVIEWING);
};
        

pijersi.presenter.resume_game = function(){
    pijersi.presenter.show_menu(false);

    pijersi.model.turns = pijersi.model.turns.slice(0, pijersi.model.current_turn + 1)

    pijersi.presenter.update_legend();
    pijersi.presenter.update_credit();

    if ( pijersi.model.credit !== 0 ) {
        pijersi.presenter.set_mode(pijersi.model.const.MODE_RUNNING);
    }
};
        

pijersi.presenter.edit_game = function(){
    pijersi.presenter.show_menu(false);
    
    pijersi.presenter.set_mode(pijersi.model.const.MODE_EDITING);
};


pijersi.presenter.show_captures = function(){
    pijersi.presenter.show_menu(false);
};


pijersi.presenter.show_labels = function(){
    pijersi.presenter.show_menu(false);
};


pijersi.presenter.toggle_player_turn = function(){
    if ( pijersi.model.mode !== pijersi.model.const.MODE_EDITING ) return;
    pijersi.presenter.change_player();
};


pijersi.presenter.show_next_turn = function(){
    if ( pijersi.model.mode !== pijersi.model.const.MODE_REVIEWING ) return;
    
    if ( pijersi.model.current_turn + 1 < pijersi.model.turns.length ) {
        pijersi.model.current_turn += 1;

        pijersi.presenter.update_legend();
        pijersi.presenter.update_credit();
    }
};


pijersi.presenter.show_previous_turn = function(){
    if ( pijersi.model.mode !== pijersi.model.const.MODE_REVIEWING ) return;
    
    if ( pijersi.model.current_turn - 1 >= 0 ) {
        pijersi.model.current_turn -= 1;

        pijersi.presenter.update_legend();
        pijersi.presenter.update_credit();
    }
};


pijersi.presenter.simulate_play = function(){
    if ( pijersi.model.mode === pijersi.model.const.MODE_RUNNING && ! pijersi.view.menu_showed) {

        pijersi.presenter.decrement_credit();					

        if ( pijersi.model.credit === 0 ) {
            pijersi.presenter.stop_game();

        } else {
            pijersi.model.new_turn();
            pijersi.presenter.update_credit();
            pijersi.presenter.update_legend();
            pijersi.presenter.change_player();
        }
    }
};
///////////////////////////////////////////////////////////////////////////////
