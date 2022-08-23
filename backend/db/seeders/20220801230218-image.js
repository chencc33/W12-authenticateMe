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
    await queryInterface.bulkInsert('Images', [
      {
        url: "https://a0.muscache.com/im/pictures/13fa1350-59bf-4f74-8b8e-f5d001654c1b.jpg?im_w=720",
        previewImage: true,
        spotId: 1,
        reviewId: 1,
        userId: 1
      },
      {
        url: "https://a0.muscache.com/im/pictures/ebc4cb6a-6374-4bb7-a143-3b8f162ee815.jpg?im_w=720",
        previewImage: true,
        spotId: 2,
        reviewId: 2,
        userId: 1
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
    await queryInterface.bulkInsert('Images', null, {})
  }
};
