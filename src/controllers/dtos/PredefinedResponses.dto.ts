import { Type } from "class-transformer";
import { IsArray, IsEnum, IsString, ValidateNested } from "class-validator";
import { ConversationChannel } from "../../interfaces/enums/ConversationChannel.enum";

export class PredefinedResponseDto {
  @IsEnum(ConversationChannel)
  channel: ConversationChannel;
  @IsString()
  entity: string;
  @IsString()
  response: string;
}

export class PredefinedResponsesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PredefinedResponseDto)
  data: PredefinedResponseDto[];
}
