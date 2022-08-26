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
    await queryInterface.bulkInsert('Reviews', [
      {
        userId: 1,
        spotId: 1,
        review: "This house is gorgeous! Beautiful inside and out! Private but so close to downtown. It was perfect for our girls getaway",
        stars: 5,
      },
      {
        userId: 1,
        spotId: 2,
        review: "Gorgeous location and great house. Would stay again!",
        stars: 4,
      },
      {
        userId: 2,
        spotId: 1,
        review: "Great place! We really enjoyed our stay!",
        stars: 4,
      },
      {
        userId: 2,
        spotId: 3,
        review: "You will not be disappointed! This ranch is meticulously maintained and creates an amazing atmosphere to relax and recharge.",
        stars: 4,
      },
      {
        userId: 2,
        spotId: 4,
        review: "Had the best time! It was great to be able to be able to relax in one of Mary’s casitas! The night sky was beautiful and the casita itself was so cute and comfortable! Will definitely be back!",
        stars: 4,
      },
      {
        userId: 2,
        spotId: 5,
        review: "This cabin is in a nice location that provides a lot of privacy even though there are houses close by. There's a fenced yard which is terrific for pets. The interior is lovely with quality decorations. ",
        stars: 5,
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
    await queryInterface.bulkDelete('Reviews', null, {})
  }
};
