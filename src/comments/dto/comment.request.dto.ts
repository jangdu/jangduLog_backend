import { PickType } from "@nestjs/swagger";
import { Comment } from "src/entities/comment.entity";

export class CreateCommentsRequestDto extends PickType(Comment, [
    'content',
    'email',
    'password',
]){}