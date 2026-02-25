import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from '../application';
import { UsersQueryRepository } from '../infrastructure';
import { PaginatedViewDto } from '../../../../core/dto';
import {
  CreateUserInputDto,
  GetUsersQueryParamsInputDto,
  UserViewDto,
} from './dto';
import {
  CreateUserApi,
  DeleteUserApi,
  GetAllUsersApi,
  GetUserApi,
} from './swagger';

@Controller('users')
export class UsersController {
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private usersService: UsersService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @GetAllUsersApi()
  async getAllUsers(
    @Query() query: GetUsersQueryParamsInputDto,
  ): Promise<PaginatedViewDto<UserViewDto>> {
    const { items, totalCount } =
      await this.usersQueryRepository.getAllUsers(query);

    const mappedItems = items.map(UserViewDto.mapToView);

    return PaginatedViewDto.mapToView({
      items: mappedItems,
      page: query.pageNumber,
      size: query.pageSize,
      totalCount,
    });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @GetUserApi()
  async getUserById(@Param('id') id: string): Promise<UserViewDto> {
    const foundUser = await this.usersQueryRepository.getUserById(id);

    if (!foundUser) {
      // throw new UserNotFoundError();
      throw new Error();
    }

    return UserViewDto.mapToView(foundUser);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @CreateUserApi()
  async createUser(@Body() body: CreateUserInputDto): Promise<UserViewDto> {
    const userId = await this.usersService.createUser(body, {
      shouldBeConfirmed: true,
    });

    const createdUser = await this.usersQueryRepository.getUserById(userId);

    if (!createdUser) {
      // throw new UserCreationFailedError();
      throw new Error();
    }

    return UserViewDto.mapToView(createdUser);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @DeleteUserApi()
  async deleteUser(@Param('id') id: string): Promise<void> {
    await this.usersService.deleteUser(id);
  }
}
