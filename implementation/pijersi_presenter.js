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
pijersi.presenter.__initModuleCalled = false;

pijersi.presenter.__initModule = function(){

    if ( pijersi.presenter.__initModuleCalled ) return;
    pijersi.presenter.__initModuleCalled = true;

    // Init required modules
    pijersi.debug.__initModule();
    pijersi.draw.__initModule();
    pijersi.rules.__initModule();

    // Init inner classes
    // None

    pijersi.presenter.user_has_interacted = false;

    pijersi.presenter.source_cell = null;
    pijersi.presenter.destination_cell = null;
    pijersi.presenter.source_cube_selected = false;
    pijersi.presenter.source_stack_selected = false;

    pijersi.presenter.ok_button = document.getElementById( "pijersi_button_ok" );
    pijersi.presenter.undo_button = document.getElementById( "pijersi_button_undo" );

    pijersi.presenter.enable_ok_button(false);
    pijersi.presenter.enable_undo_button(false);

    pijersi.debug.writeMessage( "pijersi.presenter.__initModule(): done" );
};

// --- JERSI_BEGIN: commands ---

pijersi.presenter.clearSelection = function(){
    pijersi.presenter.source_cell = null;
    pijersi.presenter.destination_cell = null;

    pijersi.presenter.source_cube_selected = false;
    pijersi.presenter.source_stack_selected = false;
};

pijersi.presenter.enable_ok_button = function(condition){
    this.ok_button.disabled = ( ! condition );
};

pijersi.presenter.ok = function(){
    pijersi.rules.saveGame();
    pijersi.presenter.enable_ok_button(false);
    pijersi.presenter.enable_undo_button(false);
};

pijersi.presenter.restartGame = function(){
    pijersi.presenter.clearSelection();
    pijersi.rules.restartGame();

    if ( pijersi.presenter.user_has_interacted ) {
        pijersi.draw.playRestartSound();
        pijersi.presenter.user_has_interacted = false; //TODO: improve the semantic
    }

    pijersi.draw.updateAllCellsDiv();
    pijersi.presenter.enable_ok_button(false);
    pijersi.presenter.enable_undo_button(false);
};

pijersi.presenter.selectCell = function(cell_index){

    pijersi.presenter.user_has_interacted = true;

    if ( ! pijersi.rules.game_is_running ) {
        return;
    }

    const cell = pijersi.rules.cells[cell_index];

    if ( pijersi.presenter.source_cell == null && pijersi.presenter.destination_cell == null ) {

        if ( pijersi.rules.isSelectableSourceCell(cell) ) {

            pijersi.presenter.source_cell = cell;
            pijersi.draw.selectCellDiv(pijersi.presenter.source_cell, true);

            if ( pijersi.rules.cellHasSelectableStack(pijersi.presenter.source_cell) ) {
                pijersi.presenter.source_stack_selected = true;
                pijersi.draw.selectCellStackDiv(pijersi.presenter.source_cell, true);

            } else if ( pijersi.rules.cellHasSelectableCube(pijersi.presenter.source_cell) ) {
                pijersi.presenter.source_cube_selected = true;
                pijersi.draw.selectCellCubeDiv(pijersi.presenter.source_cell, true);
            }
        }

    } else if ( pijersi.presenter.destination_cell == null && pijersi.presenter.source_cell != cell ) {

        if ( pijersi.rules.isSelectableDestinationCell(cell) ) {

            pijersi.presenter.destination_cell = cell;
            pijersi.draw.selectCellDiv(pijersi.presenter.destination_cell, true);

            if ( pijersi.presenter.source_stack_selected ) {
                pijersi.presenter.source_stack_selected = false;
                pijersi.draw.selectCellStackDiv(pijersi.presenter.source_cell, false);
                pijersi.draw.playMoveSound();
                pijersi.rules.moveStack(pijersi.presenter.source_cell, pijersi.presenter.destination_cell);
                pijersi.presenter.enable_ok_button(true);
                pijersi.presenter.enable_undo_button(true);

            } else if ( pijersi.presenter.source_cube_selected ) {
                pijersi.presenter.source_cube_selected = false;
                pijersi.draw.selectCellCubeDiv(pijersi.presenter.source_cell, false);
                pijersi.draw.playMoveSound();
                pijersi.rules.moveCube(pijersi.presenter.source_cell, pijersi.presenter.destination_cell);
                pijersi.presenter.enable_ok_button(true);
                pijersi.presenter.enable_undo_button(true);
            }

            pijersi.draw.selectCellDiv(pijersi.presenter.source_cell, false);
            pijersi.draw.selectCellDiv(pijersi.presenter.destination_cell, false);
            pijersi.presenter.source_cell = null;
            pijersi.presenter.destination_cell = null;

            pijersi.draw.updateAllCellsDiv();
        }

    } else if ( pijersi.presenter.source_cell == cell && pijersi.presenter.destination_cell == null ) {

        if ( pijersi.presenter.source_stack_selected ) {

            pijersi.presenter.source_stack_selected = false;
            pijersi.draw.selectCellStackDiv(pijersi.presenter.source_cell, false);

            if ( pijersi.rules.cellHasSelectableCube(pijersi.presenter.source_cell) ) {
                pijersi.presenter.source_cube_selected = true;
                pijersi.draw.selectCellCubeDiv(pijersi.presenter.source_cell, true);
            }

        } else if ( pijersi.presenter.source_cube_selected ) {

            pijersi.presenter.source_cube_selected = false;
            pijersi.draw.selectCellCubeDiv(pijersi.presenter.source_cell, false);
            pijersi.draw.selectCellDiv(pijersi.presenter.source_cell, false);
            pijersi.presenter.source_cell = null;
        }
    }
};

pijersi.presenter.startGame = function(){
    pijersi.rules.startGame();

    pijersi.draw.makeAllCellsDiv();
    pijersi.draw.makeAllCubesDiv();

    pijersi.presenter.restartGame();
};

pijersi.presenter.undo = function(){
    pijersi.presenter.clearSelection();
    pijersi.rules.loadGame();
    pijersi.draw.playUndoSound();
    pijersi.draw.updateAllCellsDiv();
    pijersi.presenter.enable_ok_button(false);
    pijersi.presenter.enable_undo_button(false);
};

pijersi.presenter.enable_undo_button = function(condition){
    this.undo_button.disabled = ( ! condition );
};

// --- JERSI_END: commands ---

//////////////////////////////////////////////////////////////////////////
