export enum PARAM {
  DATA_TYPE = 'data_type',
  DATA = 'data',

  INIT_PLAYERS = 'init_players',
  INIT_TABLE = 'init_table',
  INIT_CHAIRS = 'init_chairs',
  INIT_GAME = 'init_game',

  PLAYER_ID = 'player_id',
  PLAYER_NAME = 'player_name',
  PLAYER_WINSTREAK = 'player_winstreak',

  TABLE_CHAIR_1 = 'table_chair_1',
  TABLE_CHAIR_2 = 'table_chair_2',
  TABLE_QUEUE = 'table_queue',
  TABLE_MOVE_CHAIR = 'table_chair',
  TABLE_MOVE_FIELD_INDEX = 'table_field_index',

  CHAIR_ID = 'chair_id',
  CHAIR_PLAYER = 'chair_player',
  CHAIR_PLAYER_IS_READY = 'chair_player_is_ready',

  GAME_START = 'game_start',
  GAME_START_TS = 'game_start_ts',
  GAME_ROUND = 'game_round',
  GAME_ROUND_ITEMS = 'game_round_items',
  GAME_WINNER = 'game_winner'
}

export enum DATA_TYPE {
  INIT = 'init',
  PLAYER_REGISTER = 'player_register',
  PLAYER_CHANGE = 'player_change',
  TABLE_CHANGE = 'table_change',
  CHAIR_CHANGE = 'chair_change',
  GAME_START = 'game_start',
  GAME_END = 'game_end'
}