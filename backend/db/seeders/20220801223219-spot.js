'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Spots', [
      {
        ownerId: 1,
        address: "123 Disney Lane",
        city: "San Francisco",
        state: "California",
        country: "United States",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "App Academy",
        description: "Place where web developers are created",
        price: 123,
        previewImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8aG91c2V8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60"
      },
      {
        ownerId: 1,
        address: "456 Disney Lane",
        city: "San Francisco",
        state: "California",
        country: "United States",
        lat: 39.7645358,
        lng: -120.4730327,
        name: "App Academy clone",
        description: "Nice Place",
        price: 145,
        previewImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8aG91c2V8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60"
      },
      {
        ownerId: 2,
        address: "7123 Saguaro Dr",
        city: "Phoenix",
        state: "Arizona",
        country: "United States",
        lat: 50.7645358,
        lng: -18.4730327,
        name: "Cactuc Love Place",
        description: "You'll surely enjoy this secluded retreat!",
        price: 300,
        previewImage: "https://images.unsplash.com/photo-1568484668894-3e9ab7eb0037?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YXJpem9uYSUyMGhvdXNlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=400&q=60"
      },
      {
        ownerId: 2,
        address: "5126 Speedway Blvd",
        city: "Page",
        state: "Arizona",
        country: "United States",
        lat: 465.7645358,
        lng: -48.4730327,
        name: "Acre's Away Land",
        description: "Escape to a beautifully renovated cabin on an acre of land in the beautiful Pine forest.",
        price: 199,
        previewImage: "https://images.unsplash.com/photo-1624132821184-4baae6e1cfca?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fGFyaXpvbmElMjBob3VzZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=400&q=60"
      },
      {
        ownerId: 3,
        address: "908 Dobson Rd",
        city: "Phoenix",
        state: "Arizona",
        country: "United States",
        lat: 58.7645358,
        lng: -20.4730327,
        name: "Luxe Wine Country Home",
        description: "Located in beautiful Springs -- just a 20 minute drive from the world famous National Park",
        price: 245,
        previewImage: "https://images.unsplash.com/photo-1612643171295-be318405b447?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8YXJpem9uYSUyMGhvdXNlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=400&q=60"
      }
    ])
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Spots', null, {})
  }
};
