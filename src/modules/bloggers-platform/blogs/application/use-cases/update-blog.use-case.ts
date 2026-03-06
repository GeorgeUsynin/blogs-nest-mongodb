import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure';
import { UpdateBlogDto } from '../dto';
import { UpdateBlogDomainDto } from '../../domain/dto';
import { BlogNotFoundError } from '../../../../../core/exceptions';

export class UpdateBlogCommand {
  constructor(public readonly dto: UpdateBlogDto) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogCommand> {
  constructor(private blogsRepository: BlogsRepository) {}

  async execute({ dto }: UpdateBlogCommand): Promise<void> {
    const foundBlog = await this.blogsRepository.findById(dto.id);

    if (!foundBlog) throw new BlogNotFoundError();

    const updateBlogDomainDto: UpdateBlogDomainDto = {
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
    };

    foundBlog.updateBlog(updateBlogDomainDto);

    await this.blogsRepository.save(foundBlog);
  }
}
