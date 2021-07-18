(function(){ 
    let piece_list = Array.from(document.querySelectorAll("piece")).map(p => {
        let color_name = p.className.split(" ");
        let transform = p.style.transform;
        
        // Verify this is not a ghost piece or an icon
        if (color_name.length == 2 && transform !== "") {
            let color = color_name[0];
            let pieceName = color_name[1];
            
            return {
                color: color,
                name: pieceName,
                square: getSquareFromTransform(transform)
            }        
        }
    }).filter(p => { // Remove undefined pieces
        if (p == undefined) {
            return false;
        } else {
            return true;
        }
    });
    
    function getSquareFromTransform(transform) {
        let tx_ty = transform.split("(")[1].split(", ");
        let tx = tx_ty[0];
        let ty = tx_ty[1].substr(0, tx_ty[1].length - 1);
        return fileFromPixelTransform(tx) + rankFromPixelTransform(ty);
    }
    
    function rankFromPixelTransform(pixelValue) {
        let value = pixelValue.substr(0, pixelValue.length - 2);
        let n = parseInt(value);
        let d = n / 100;
        return 8 - d;
    }
    
    function fileFromPixelTransform(pixelValue) {
        let value = pixelValue.substr(0, pixelValue.length - 2);
        let n = parseInt(value);
        let d = n / 100;
        let letter_lookup = "abcdefgh";
        return letter_lookup[d];
    }
    
    let sort_weight = {
        "white": 0,
        "black": 10, // sort after even the heaviest white piece
        "pawn": 1,
        "knight": 2,
        "bishop": 3,
        "rook": 4,
        "king": 5,
        "queen": 6
    };
    
    // Sort according to weight and then square precidece from a to h
    piece_list.sort((a, b) => {
        let a_value = sort_weight[a.color] + sort_weight[a.name];
        let b_value = sort_weight[b.color] + sort_weight[b.name];
        if (a_value === b_value) {
            return (a.square < b.square)? -1 : 1;
        } else {
            return a_value - b_value;
        }
    });
    
    console.log(piece_list);
    
    // Announce the board
    
    function say(text_or_piece) {
        if (text_or_piece.text !== undefined) {
            window.speechSynthesis.speak(new SpeechSynthesisUtterance(text_or_piece.text));
        } else {
            window.speechSynthesis.speak(new SpeechSynthesisUtterance(getTextForPiece(text_or_piece)));
        }
    }
    
    function getTextForPiece(piece) {
        return piece.color + " " + piece.name + " " + getTextForSquare(piece.square);
    }
    
    function getTextForSquare(square) {
        let letter = square[0].toUpperCase();
        let number = square[1];
        return letter + " " + number;
    }
    
    let white_all = piece_list.filter(p => p.color === "white");
    let white_pawn = white_all.filter(p => p.name === "pawn");
    let white_pieces = white_all.filter(p => p.name !== "pawn");
    
    let black_all = piece_list.filter(p => p.color === "black");
    let black_pawn = black_all.filter(p => p.name === "pawn");
    let black_pieces = black_all.filter(p => p.name !== "pawn");
    
    let say_list = [];
    
    if (white_pawn.length > 0) {
        for (let p of white_pawn) {
            say_list.push(p);
        }
    }
    
    for (let p of white_pieces) {
        say_list.push(p);
    }
    
    if (black_pawn.length > 0) {
        for (let p of black_pawn) {
            say_list.push(p);
        }
    }
    
    for (let p of black_pieces) {
        say_list.push(p);
    }
    
    let timeSpacing = 3500;
    let index = 0;
    
    function next() {
        setTimeout(() => {
            say(say_list[index]);
            index += 1;
    
            // If there are more items then schedule next item 
            if (index < say_list.length) {
                next();
            }
    
        }, timeSpacing);
    };
    
    // Say first item
    say(say_list[index]);
    index += 1;
    
    // Schedule next item
    next();    
})();