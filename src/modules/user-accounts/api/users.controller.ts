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
import { PaginatedViewDto } from '../../../core/dto';
import {
  CreateUserInputDto,
  GetUsersQueryParamsInputDto,
  UserViewDto,
} from './dto';

@Controller('users')
export class UsersController {
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private usersService: UsersService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
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

  @Post()
  @HttpCode(HttpStatus.CREATED)
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
  async deleteUser(@Param('id') id: string): Promise<void> {
    await this.usersService.deleteUser(id);
  }
}
