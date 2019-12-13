exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('opportunities').del()
    .then(function () {
      // Inserts seed entries
      return knex('opportunities').insert([
        {
          direction: 'ex',
          ask_price: 12345.678,
          ask_quantity: 200,
          bid_price: 87654.321,
          bid_quantity: 300,
          dt_server: + new Date()
        }
      ]);
    });
};
