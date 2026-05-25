window.GoGame=window.GoGame||{};GoGame.AIRandom={pick(game,color){const moves=GoGame.Rules.legalMoves(game.board,game.size,color,game.hashes);return moves.length?GoGame.Utils.choice(moves):null}};
