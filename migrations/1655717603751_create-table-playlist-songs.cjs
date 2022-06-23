exports.up = (pgm) => {
  pgm.createTable('playlist_songs', {
    id: {
      type: 'VARCHAR(32)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(32)',
      references: '"playlists"',
      onDelete: 'cascade',
    },
    song_id: {
      type: 'VARCHAR(32)',
      references: '"songs"',
      onDelete: 'cascade',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('playlist_songs');
};
