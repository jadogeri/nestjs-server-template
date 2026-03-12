import UserSeeder from './user.seeder';


describe('UserSeeder', () => {
  let seeder: UserSeeder;
  let mockDataSource: any;
  let mockFactoryManager: any;
  let mockRepos: any;

  beforeEach(() => {
    seeder = new UserSeeder();

    // Define mock repository methods
    mockRepos = {
      User: { create: jest.fn() },
      Auth: { 
        findOne: jest.fn(), 
        create: jest.fn(), 
        save: jest.fn().mockResolvedValue({ user: { id: 'admin-id' } }) 
      },
      Role: { findOne: jest.fn() },
      Contact: { count: jest.fn() },
      Profile: { findOne: jest.fn() },
    };

    mockDataSource = {
      getRepository: jest.fn((entity) => mockRepos[entity.name]),
    };

    mockFactoryManager = {
      get: jest.fn().mockReturnValue({
        save: jest.fn().mockResolvedValue({ id: 'profile-id' }),
        saveMany: jest.fn().mockResolvedValue(new Array(10)),
      }),
    };

    // Set default environment variables
    process.env.ROOT_EMAIL = 'admin@test.com';
    process.env.ROOT_PASSWORD = 'password123';
    process.env.ROOT_FIRST_NAME = 'Admin';
    process.env.ROOT_LAST_NAME = 'User';
    process.env.ROOT_DATE_OF_BIRTH = '1990-01-01';
  });

  // 1. Env Var Guard
  it('should abort if required environment variables are missing', async () => {
    delete process.env.ROOT_EMAIL;
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();
    await seeder.run(mockDataSource, mockFactoryManager);
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('SEEDING ABORTED'));
    errorSpy.mockRestore();
  });

  // 2. Role Guard
  it('should abort if SUPER_USER role is missing', async () => {
    (mockRepos.Role.findOne as jest.Mock).mockResolvedValue(null);
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();
    await seeder.run(mockDataSource, mockFactoryManager);
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('Aborting'));
    errorSpy.mockRestore();
  });

  // 3. Duplicate Guard
  it('should skip if admin already exists', async () => {
    (mockRepos.Role.findOne as jest.Mock).mockResolvedValue({ name: 'SUPER_USER' });
    (mockRepos.Auth.findOne as jest.Mock).mockResolvedValue({ id: 1 });
    const logSpy = jest.spyOn(console, 'log').mockImplementation();
    await seeder.run(mockDataSource, mockFactoryManager);
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('already exists'));
    logSpy.mockRestore();
  });

  // 4. Successful Creation
  it('should create auth and user entities', async () => {
    (mockRepos.Role.findOne as jest.Mock).mockResolvedValue({ name: 'SUPER_USER' });
    (mockRepos.Auth.findOne as jest.Mock).mockResolvedValue(null);
    await seeder.run(mockDataSource, mockFactoryManager);
    expect(mockRepos.Auth.save).toHaveBeenCalled();
  });

  // 5. Profile Check
  it('should check if profile exists for user', async () => {
    (mockRepos.Role.findOne as jest.Mock).mockResolvedValue({ name: 'SUPER_USER' });
    (mockRepos.Auth.findOne as jest.Mock).mockResolvedValue(null);
    await seeder.run(mockDataSource, mockFactoryManager);
    expect(mockRepos.Profile.findOne).toHaveBeenCalled();
  });

  // 6. Profile Factory Call
  it('should call profile factory if profile is missing', async () => {
    (mockRepos.Role.findOne as jest.Mock).mockResolvedValue({ name: 'SUPER_USER' });
    (mockRepos.Auth.findOne as jest.Mock).mockResolvedValue(null);
    (mockRepos.Profile.findOne as jest.Mock).mockResolvedValue(null);
    await seeder.run(mockDataSource, mockFactoryManager);
    expect(mockFactoryManager.get).toHaveBeenCalled();
  });

  // 7. Contact Count
  it('should check existing contact count', async () => {
    (mockRepos.Role.findOne as jest.Mock).mockResolvedValue({ name: 'SUPER_USER' });
    (mockRepos.Auth.findOne as jest.Mock).mockResolvedValue(null);
    await seeder.run(mockDataSource, mockFactoryManager);
    expect(mockRepos.Contact.count).toHaveBeenCalled();
  });

  // 8. Contact Factory Call
  it('should generate 10 contacts if count is 0', async () => {
    (mockRepos.Role.findOne as jest.Mock).mockResolvedValue({ name: 'SUPER_USER' });
    (mockRepos.Auth.findOne as jest.Mock).mockResolvedValue(null);
    (mockRepos.Contact.count as jest.Mock).mockResolvedValue(0);
    const factory = mockFactoryManager.get();
    await seeder.run(mockDataSource, mockFactoryManager);
    expect(factory.saveMany).toHaveBeenCalledWith(10, expect.any(Object));
  });

  // 9. Entity Linking
  it('should link the user object to the auth object', async () => {
    (mockRepos.Role.findOne as jest.Mock).mockResolvedValue({ name: 'SUPER_USER' });
    (mockRepos.Auth.findOne as jest.Mock).mockResolvedValue(null);
    const mockUser = { firstName: 'Admin' };
    (mockRepos.User.create as jest.Mock).mockReturnValue(mockUser);
    await seeder.run(mockDataSource, mockFactoryManager);
    expect(mockRepos.Auth.create).toHaveBeenCalledWith(expect.objectContaining({ user: mockUser }));
  });


});
