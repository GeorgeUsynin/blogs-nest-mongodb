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
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
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
import { ObjectIdValidationPipe } from '../../../../core/pipes';
import {
  UserCreationFailedError,
  UserNotFoundError,
} from '../../../../core/exceptions';
import { BasicAuthGuard } from '../guards/basic';
import { Public } from '../guards/decorators';
import { CreateUserCommand } from '../application/use-cases';

@Controller('users')
@UseGuards(BasicAuthGuard)
export class UsersController {
  constructor(
    private commandBus: CommandBus,
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

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @GetUserApi()
  async getUserById(
    @Param('id', ObjectIdValidationPipe) id: string,
  ): Promise<UserViewDto> {
    const foundUser = await this.usersQueryRepository.getUserById(id);

    if (!foundUser) {
      throw new UserNotFoundError();
    }

    return UserViewDto.mapToView(foundUser);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @CreateUserApi()
  async createUser(@Body() body: CreateUserInputDto): Promise<UserViewDto> {
    const userId = await this.commandBus.execute(
      new CreateUserCommand(body, { shouldBeConfirmed: true }),
    );

    const createdUser = await this.usersQueryRepository.getUserById(userId);

    if (!createdUser) {
      throw new UserCreationFailedError();
    }

    return UserViewDto.mapToView(createdUser);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @DeleteUserApi()
  async deleteUser(
    @Param('id', ObjectIdValidationPipe) id: string,
  ): Promise<void> {
    await this.usersService.deleteUser(id);
  }
}
