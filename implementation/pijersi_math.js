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
pijersi.math = { };
pijersi.math.__init_called = false;

pijersi.math.__init = function(){


    if ( pijersi.math.__init_called ) return;
    pijersi.math.__init_called = true;

    // Init the required sub-modules
    pijersi.debug.__init();

    // Init the sub-module constants
    pijersi.math.const = {};

    // Freeze the sub-module constants
    Object.freeze(pijersi.math.const);

    // Init the sub-module variables

    pijersi.math.TinyVector = ( function(){

        class TinyVector {

            constructor(x, y){
                this.x = x;
                this.y = y;
            };


            toString(){ return "TinyVector(" + this.x + "," + this.y + ")" ;  };


            neg(){ return new TinyVector( -this.x, -this.y ) ;  };


            add(that){ 
                if ( that instanceof TinyVector ) {
                    return new TinyVector(this.x + that.x, this.y + that.y) ; 

                } else if ( typeof that === "number" ) {
                    return new TinyVector(this.x + that, this.y + that) ; 

                } else {
                    pijersi.debug.log_error("unexpected 'that' = " + that);
                }
             };


           sub(that){ 
                if ( that instanceof TinyVector ) {
                    return new TinyVector(this.x - that.x, this.y - that.y) ; 

                } else if ( typeof that === "number" ) {
                    return new TinyVector(this.x - that, this.y - that) ; 

                } else {
                    pijersi.debug.log_error("unexpected 'that' = " + that);
                }
             };


           mul(that){ 
                if ( typeof that === "number" ) {
                    return new TinyVector(that*this.x , that*this.y ) ; 

                } else {
                    pijersi.debug.log_error("unexpected 'that' = " + that);
                }
             };


            dot(that){ 
                if ( that instanceof TinyVector ) {
                    return (this.x*that.x + this.y*that.y) ; 

                 } else {
                    pijersi.debug.log_error("unexpected 'that' = " + that);
                }
             };


            norm(){ return Math.sqrt(this.x**2 + this.y**2) ;  };


            rotate(angle){
                const cos_angle = Math.cos(angle);
                const sin_angle = Math.sin(angle);

                const new_x = cos_angle*this.x - sin_angle*this.y;
                const new_y = sin_angle*this.x + cos_angle*this.y;

                return new TinyVector(new_x, new_y);
            };

        } ;

        return TinyVector;
    } )();

    // Seal the sub-module
    Object.seal(pijersi.math);
};