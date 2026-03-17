import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { PlansRepositoryService } from '../planner/plans.repository.service';
import { JwtService } from '@nestjs/jwt';
import JwtConfig from './config/jwt.config';
import refreshJwtConfig from './config/refresh-jwt.config';
import exchangeJwtConfig from './config/exchange-jwt.config';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid'),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let plansRepoService: PlansRepositoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findUserByEmail: jest.fn(),
            createUser: jest.fn(),
            updateUser: jest.fn(),
          },
        },
        {
          provide: PlansRepositoryService,
          useValue: {
            createPlan: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {}, 
        },
        {
          provide: JwtConfig.KEY,
          useValue: {}, 
        },
        {
          provide: refreshJwtConfig.KEY,
          useValue: {}, 
        },
        {
          provide: exchangeJwtConfig.KEY,
          useValue: {}, 
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    plansRepoService = module.get<PlansRepositoryService>(PlansRepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateGoogleUser', () => {
    it('should create a new user and a plan if the user does not exist yet', async () => {
      // Arrange
      const mockGoogleUserDto = { email: 'test@example.com', firstName: 'Test', lastName: 'User' } as any;
      const mockCreatedUser = { id: 1, email: 'test@example.com' };
      
      jest.spyOn(usersService, 'findUserByEmail').mockResolvedValue(null); // User not found
      jest.spyOn(usersService, 'createUser').mockResolvedValue(mockCreatedUser as any);
      jest.spyOn(usersService, 'updateUser').mockResolvedValue(undefined as any);
      jest.spyOn(plansRepoService, 'createPlan').mockResolvedValue(undefined as any);

      // Act
      const result = await service.validateGoogleUser(mockGoogleUserDto);

      // Assert
      expect(usersService.findUserByEmail).toHaveBeenCalledWith(mockGoogleUserDto.email);
      expect(usersService.createUser).toHaveBeenCalledWith(mockGoogleUserDto);
      expect(usersService.updateUser).toHaveBeenCalledWith(mockCreatedUser.id, { rcAppUserId: '1rc-mock-uuid' });
      expect(plansRepoService.createPlan).toHaveBeenCalledWith(mockCreatedUser.id);
      expect(result).toEqual(mockCreatedUser);
    });
  });
});
