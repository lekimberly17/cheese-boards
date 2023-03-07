const { User, Board, Cheese } = require('./models');
const { sequelize } = require('./db');

describe('User model', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  test('should create a new user', async () => {
    const user = await User.create({ name: 'John Doe', email: 'john.doe@example.com' });
    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('john.doe@example.com');
  });
});

describe('Board model', () => {
  test('should create a new board', async () => {
    const board = await Board.create({ 
      type: 'skateboard',
      description: 'a cool skateboard',
      rating: 8
    });
    expect(board.type).toBe('skateboard');
    expect(board.description).toBe('a cool skateboard');
    expect(board.rating).toBe(8);
  });

  test('should update an existing board', async () => {
    const board = await Board.findOne({ where: { type: 'skateboard' } });
    board.rating = 9;
    await board.save();
    const updatedBoard = await Board.findByPk(board.id);
    expect(updatedBoard.rating).toBe(9);
  });

  test('should delete a board', async () => {
    const board = await Board.findOne({ where: { type: 'skateboard' } });
    await board.destroy();
    const deletedBoard = await Board.findByPk(board.id);
    expect(deletedBoard).toBeNull();
  });
});

describe('Cheese model', () => {
  test('should create a new cheese', async () => {
    const cheese = await Cheese.create({ 
      title: 'Cheddar',
      description: 'a classic hard cheese'
    });
    expect(cheese.title).toBe('Cheddar');
    expect(cheese.description).toBe('a classic hard cheese');
  });

  test('should update an existing cheese', async () => {
    const cheese = await Cheese.findOne({ where: { title: 'Cheddar' } });
    cheese.description = 'a sharp, tangy cheese';
    await cheese.save();
    const updatedCheese = await Cheese.findByPk(cheese.id);
    expect(updatedCheese.description).toBe('a sharp, tangy cheese');
  });

  test('should delete a cheese', async () => {
    const cheese = await Cheese.findOne({ where: { title: 'Cheddar' } });
    await cheese.destroy();
    const deletedCheese = await Cheese.findByPk(cheese.id);
    expect(deletedCheese).toBeNull();
  });



  describe('Board-User relationship', () => {
    beforeAll(async () => {
      await sequelize.sync({ force: true });
    });
  
    test('should create a new board and associate it with a user', async () => {
      const user = await User.create({ name: 'John Doe', email: 'john.doe@example.com' });
      const board = await Board.create({ 
        type: 'skateboard',
        description: 'a cool skateboard',
        rating: 8,
        UserId: user.id
      });
      const userWithBoards = await User.findOne({ where: { id: user.id }, include: [Board] });
      expect(userWithBoards.Boards).toContainEqual(expect.objectContaining({ id: board.id }));
    });
  });
  
  describe('Board-Cheese relationship', () => {
    beforeAll(async () => {
      await sequelize.sync({ force: true });
    });
  
    test('should create a new board and associate it with a cheese', async () => {
      const board = await Board.create({ 
        type: 'skateboard',
        description: 'a cool skateboard',
        rating: 8
      });
      const cheese = await Cheese.create({ 
        title: 'Cheddar',
        description: 'a classic hard cheese'
      });
      await board.addCheese(cheese);
      const boardWithCheeses = await Board.findOne({ where: { id: board.id }, include: [Cheese] });
      expect(boardWithCheeses.Cheeses).toContainEqual(expect.objectContaining({ id: cheese.id }));
    });
  });

  describe('Eager loading', () => {
    beforeAll(async () => {
      await sequelize.sync({ force: true });
    });
  
    test('should load a board with its cheeses', async () => {
      const board = await Board.create({ 
        type: 'skateboard',
        description: 'a cool skateboard',
        rating: 8
      });
      const cheese1 = await Cheese.create({ 
        title: 'Cheddar',
        description: 'a classic hard cheese'
      });
      const cheese2 = await Cheese.create({ 
        title: 'Brie',
        description: 'a soft, creamy cheese'
      });
      await board.addCheese(cheese1);
      await board.addCheese(cheese2);
      const boardWithCheeses = await Board.findOne({ where: { id: board.id }, include: [Cheese] });
      expect(boardWithCheeses.Cheeses).toContainEqual(expect.objectContaining({ id: cheese1.id }));
      expect(boardWithCheeses.Cheeses).toContainEqual(expect.objectContaining({ id: cheese2.id }));
    });
  });
});

