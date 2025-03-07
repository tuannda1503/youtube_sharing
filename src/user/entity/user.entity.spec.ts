import { User } from './user.entity';

describe('User Entity', () => {
  it('should create a user instance', () => {
    const user = new User();
    user.id = 1;
    user.email = 'test@example.com';
    user.password = 'testpass';
    user.createdAt = new Date();
    user.updatedAt = new Date();

    expect(user).toBeDefined();
    expect(user.id).toBe(1);
    expect(user.email).toBe('test@example.com');
    expect(user.password).toBe('testpass');
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
  });

  it('should have default values for createdAt and updatedAt', () => {
    const user = new User();
    expect(user.createdAt).toBeUndefined(); // Initially undefined
    expect(user.updatedAt).toBeUndefined(); // Initially undefined
  });

  it('should set createdAt and updatedAt when saved', () => {
    const user = new User();
    user.createdAt = new Date();
    user.updatedAt = new Date();

    expect(user.createdAt).toBeDefined();
    expect(user.updatedAt).toBeDefined();
  });
}); 