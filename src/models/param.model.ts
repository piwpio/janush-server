export enum PARAM {
  DATA_TYPE,
  DATA,
  PLAYER_ID,
  PLAYER_NAME,
  PLAYER_WINSTREAK,
  PLAYER_MAX_WINSTREAK,
  PLAYER_WIN_COUNTER,
  PLAYER_LOST_COUNTER,
  TABLE_QUEUE,
  CHAIR_ID,
  CHAIR_PLAYER,
  CHAIR_PLAYER_IS_READY,
  GAME_START_TS,
  GAME_IS_ON,
  GAME_FIELDS,
  GAME_PLAYERS,
  GAME_ROUND,
  GAME_ROUND_ITEMS,
  GAME_NEXT_UPDATE_TS,
  GAME_WINNER,
  GAME_WINNER_SCORE,
  GAME_LOSER,
  GAME_LOSER_SCORE,
  MEPLE_ID,
  MEPLE_FIELD_INDEX,
  MEPLE_MOVE_DIRECTION,
  MEPLE_POINTS
}

export enum DATA_TYPE {
  PLAYER_REGISTER,
  PLAYER_UNREGISTER,
  PLAYER_CHANGE,
  TABLE_CHANGE,
  CHAIR_CHANGE,
  GAME_INIT,
  GAME_UPDATE,
  GAME_END,
  GAME_MEPLE_COLLECT,
  MEPLE_CHANGE
}

// export enum PARAM {
//   DATA_TYPE = 'data_type',
//   DATA = 'data',
//
//   PLAYER_ID = 'player_id',
//   PLAYER_NAME = 'player_name',
//   PLAYER_WINSTREAK = 'player_winstreak',
//   PLAYER_MAX_WINSTREAK = 'player_max_winstreak',
//   PLAYER_WIN_COUNTER = 'player_win_counter',
//   PLAYER_LOST_COUNTER = 'player_lost_counter',
//
//   TABLE_QUEUE = 'table_queue',
//
//   CHAIR_ID = 'chair_id',
//   CHAIR_PLAYER = 'chair_player',
//   CHAIR_PLAYER_IS_READY = 'chair_player_is_ready',
//
//   GAME_START_TS = 'game_start_ts',
//   GAME_IS_ON = 'game_is_on',
//   GAME_FIELDS = 'game_fields',
//   GAME_PLAYERS = 'game_players',
//   GAME_ROUND = 'game_round',
//   GAME_ROUND_ITEMS = 'game_round_items',
//   GAME_NEXT_UPDATE_TS = 'game_next_update_ts',
//   GAME_WINNER = 'game_winner',
//   GAME_WINNER_SCORE = 'game_winner_score',
//   GAME_LOSER = 'game_loser',
//   GAME_LOSER_SCORE = 'game_loser_score',
//
//   MEPLE_ID = 'meple_id',
//   MEPLE_FIELD_INDEX = 'meple_field_index',
//   MEPLE_MOVE_DIRECTION = 'meple_move_direction',
//   MEPLE_POINTS = 'meple_points'
// }
//
// export enum DATA_TYPE {
//   PLAYER_REGISTER = 'player_register',
//   PLAYER_UNREGISTER = 'player_unregister',
//   PLAYER_CHANGE = 'player_change',
//   TABLE_CHANGE = 'table_change',
//   CHAIR_CHANGE = 'chair_change',
//   GAME_INIT = 'game_init',
//   GAME_UPDATE = 'game_update',
//   GAME_END = 'game_end',
//   GAME_MEPLE_COLLECT = 'game_meple_collect',
//   MEPLE_CHANGE = 'meple_change'
// }
