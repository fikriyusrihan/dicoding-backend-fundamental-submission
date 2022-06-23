exports.up = (pgm) => {
  pgm.createTable('albums', {
    id: {
      type: 'VARCHAR(32)',
      primaryKey: true,
    },
    name: {
      type: 'VARCHAR(128)',
      notNull: true,
    },
    year: {
      type: 'INT',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('albums');
};
