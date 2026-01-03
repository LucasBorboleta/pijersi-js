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
const pijersi = { };
pijersi.__init_called = false;

pijersi.__init = function(){

    if ( pijersi.__init_called ) return;
    pijersi.__init_called = true;

    // Init all the sub-modules
    pijersi.debug.__init();
    pijersi.math.__init();
    pijersi.model.__init();
    pijersi.view.__init();
    pijersi.presenter.__init();

    // Seal the module
    Object.seal(pijersi);

    pijersi.view.toggle_checkbox('pijersi-view-show-captures-id')
    pijersi.view.toggle_checkbox('pijersi-view-show-labels-id')
    
    pijersi.presenter.new_game();
};

///////////////////////////////////////////////////////////////////////////////
